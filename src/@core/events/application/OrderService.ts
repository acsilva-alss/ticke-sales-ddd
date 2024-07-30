import { UnitOfWork } from 'src/@core/common';
import {
  CustomerRepository,
  EventRepository,
  Order,
  OrderRepository,
  Reservation,
  ReservationRepository,
  SectionId,
  SpotId,
} from '../domain';
import { CreateInput } from './dto/OrderServiceDto';
import { PaymentGateway } from './PaymentGateway';

export class OrderService {
  constructor(
    private orderRepository: OrderRepository,
    private eventRepository: EventRepository,
    private customerRepository: CustomerRepository,
    private reservationRepository: ReservationRepository,
    private unitOfWork: UnitOfWork,
    private paymentGateway: PaymentGateway,
  ) {}

  public async list() {
    return this.orderRepository.findAll();
  }

  // Restrições do negócio:
  // Só podemos fazer uma reserva para um lugar
  // O pagamento precisa ser feito na hora
  public async create(input: CreateInput) {
    const [event, customer] = await Promise.all([
      this.eventRepository.findById(input.eventId),
      this.customerRepository.findById(input.customerId),
    ]);

    if (!event || !customer) {
      throw new Error('Invalid input.');
    }
    const sectionId = new SectionId(input.sectionId);
    const spotId = new SpotId(input.spotId);
    if (!event.allowReserveSpot({ sectionId, spotId })) {
      throw new Error('Spot not available');
    }
    const reservation = await this.reservationRepository.findById(spotId);
    if (reservation) {
      throw new Error('Spot already reserved');
    }
    await this.unitOfWork.runTransaction(async () => {
      const newReservation = Reservation.create({
        spotId: spotId.value,
        customerId: customer.id.value,
      });
      await this.reservationRepository.add(newReservation);
      try {
        await this.unitOfWork.commit();
        const section = event.findSection(sectionId);
        await this.paymentGateway.payment({
          token: input.cardToken,
          amount: section.price,
        });

        const newOrder = Order.create({
          customerId: customer.id.value,
          spotId: spotId.value,
          amount: section.price,
        });

        newOrder.pay();

        await this.orderRepository.add(newOrder);
        event.markSpotAsReserved({
          sectionId,
          spotId,
        });

        await this.eventRepository.add(event);

        await this.unitOfWork.commit();
        return newOrder.id.value;
      } catch (e) {
        const section = event.findSection(sectionId);

        const newOrder = Order.create({
          customerId: customer.id.value,
          spotId: spotId.value,
          amount: section.price,
        });

        newOrder.cancel();
        await this.unitOfWork.commit();
        throw new Error('Reserved error');
      }
    });
  }
}
