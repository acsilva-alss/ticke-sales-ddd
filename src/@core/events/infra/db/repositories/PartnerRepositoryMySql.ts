import { EntityManager } from '@mikro-orm/mysql';
import { Partner, PartnerId, PartnerRepository } from 'src/@core/events/domain';

export class PartnerRepositoryMySql implements PartnerRepository {
  constructor(private entityManager: EntityManager) {}

  async add(entity: Partner): Promise<void> {
    this.entityManager.persist(entity);
  }

  async findById(id: string | PartnerId): Promise<Partner | null> {
    return this.entityManager.findOneOrFail(Partner, {
      id: typeof id === 'string' ? new PartnerId(id) : id,
    });
  }

  async findAll(): Promise<Partner[]> {
    return this.entityManager.find(Partner, {});
  }

  async delete(entity: Partner): Promise<void> {
    this.entityManager.remove(entity);
  }
}
