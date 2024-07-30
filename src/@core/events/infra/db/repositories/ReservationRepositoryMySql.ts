import { EntityManager } from '@mikro-orm/mysql';
import {
  Reservation,
  ReservationRepository,
  SpotId,
} from 'src/@core/events/domain';

export class ReservationRepositoryMySql implements ReservationRepository {
  constructor(private entityManager: EntityManager) {}

  async add(entity: Reservation): Promise<void> {
    this.entityManager.persist(entity);
  }

  async findById(spotId: string | SpotId): Promise<Reservation | null> {
    return this.entityManager.findOneOrFail(Reservation, {
      spotId: typeof spotId === 'string' ? new SpotId(spotId) : spotId,
    });
  }

  async findAll(): Promise<Reservation[]> {
    return this.entityManager.find(Reservation, {});
  }

  async delete(entity: Reservation): Promise<void> {
    this.entityManager.remove(entity);
  }
}
