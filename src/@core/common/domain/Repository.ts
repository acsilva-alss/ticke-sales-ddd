import { AggregateRoot } from './AggregateRoot';

export interface IRepository<E extends AggregateRoot> {
  add(entity: E): Promise<void>;
  findById(id: any): Promise<E | null>;
  findAll(): Promise<E[]>;
  delete(entity: E): Promise<void>;
}
