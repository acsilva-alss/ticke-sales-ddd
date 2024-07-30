import { EntityManager } from '@mikro-orm/mysql';
import { UnitOfWork } from '../application/UnitOfWork';

export class UnitOfWorkMikroOrm implements UnitOfWork {
  constructor(private em: EntityManager) {}

  beginTransaction(): Promise<void> {
    return this.em.begin();
  }
  completeTransaction(): Promise<void> {
    return this.em.commit();
  }
  rollbackTransaction(): Promise<void> {
    return this.em.rollback();
  }

  runTransaction<T>(callback: () => Promise<T>): Promise<T> {
    return this.em.transactional(callback);
  }

  async commit(): Promise<void> {
    return this.em.flush();
  }
  async rollback(): Promise<void> {
    return this.em.clear();
  }
}
