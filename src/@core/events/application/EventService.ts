import { UnitOfWork } from 'src/@core/common/';
import {
  EventRepository,
  PartnerRepository,
  SectionId,
  SpotId,
} from '../domain';
import {
  AddSectionInput,
  AddSectionOutput,
  CreateEventInput,
  CreateEventOutput,
  FindSectionsOutput,
  FindSpotsOutput,
  UpdateEventInput,
  UpdateEventOutput,
} from './dto/EventServiceDto';

export class EventService {
  constructor(
    private eventRepository: EventRepository,
    private partnerRepository: PartnerRepository,
    private unitOfWork: UnitOfWork,
  ) {}

  async create(input: CreateEventInput): Promise<CreateEventOutput> {
    const { partnerId, name, description, date } = input;
    const partner = await this.partnerRepository.findById(partnerId);
    if (!partner) {
      throw new Error('Partner not found');
    }

    const event = partner.initEvent({
      name,
      description,
      date,
    });
    await this.eventRepository.add(event);
    await this.unitOfWork.commit();
    return { id: event.id.value, name: event.name.value };
  }

  async update(
    id: string,
    input: UpdateEventInput,
  ): Promise<UpdateEventOutput> {
    const { name, description, date } = input;
    const event = await this.eventRepository.findById(id);
    if (!event) {
      throw new Error('Event not found');
    }

    name && event.changeName(name);
    description && event.changeDescription(description);
    date && event.changeDate(date);

    await this.eventRepository.add(event);
    await this.unitOfWork.commit();
    return { id: event.id.value, name: event.name.value };
  }

  async addSection(input: AddSectionInput): Promise<AddSectionOutput> {
    const { name, description, eventId, price, totalSpots } = input;
    const event = await this.eventRepository.findById(eventId);
    if (!event) {
      throw new Error('Event not found');
    }
    event.addSection({ name, price, totalSpots, description });

    await this.eventRepository.add(event);
    await this.unitOfWork.commit();
    return { id: event.id.value, name: event.name.value };
  }

  async findSpots(
    eventId: string,
    sectionId: string,
  ): Promise<FindSpotsOutput> {
    const event = await this.eventRepository.findById(eventId);
    if (!event) {
      throw new Error('Event not found');
    }

    const section = event.sections.find(
      (section) => section.id.value === sectionId,
    );
    if (!section) {
      throw new Error('Section not found');
    }

    return section.spots.map((spot) => ({
      id: spot.id.value,
      location: spot.location,
      isReserved: spot.isReserved,
      isPublished: spot.isPublished,
    }));
  }

  async findSections(eventId: string): Promise<FindSectionsOutput> {
    const event = await this.eventRepository.findById(eventId);
    return event.sections.map((section) => {
      const spots = section.spots.map((spot) => ({
        id: spot.id.value,
        location: spot.location,
        isReserved: spot.isReserved,
        isPublished: spot.isPublished,
      }));
      return {
        name: section.name.value,
        description: section.description,
        isPublished: section.isPublished,
        totalSpots: section.totalSpots,
        totalSpotsReserved: section.totalSpotsReserved,
        price: section.price,
        spots,
      };
    });
  }

  async updateLocation(
    location: string,
    eventId: string,
    sectionId: string,
    spotId: string,
  ): Promise<void> {
    const event = await this.eventRepository.findById(eventId);
    if (!event) {
      throw new Error('Event not found');
    }

    event.changeLocation({
      sectionId: new SectionId(sectionId),
      location,
      spotId: new SpotId(spotId),
    });
    await this.eventRepository.add(event);
    await this.unitOfWork.commit();
  }

  async publishAll(eventId: string): Promise<void> {
    const event = await this.eventRepository.findById(eventId);
    if (!event) {
      throw new Error('Event not found');
    }

    event.publishAll();
    await this.eventRepository.add(event);
    await this.unitOfWork.commit();
  }
}
