import { IRepository } from 'src/@core/common';
import { Customer } from '../entities';

export interface CustomerRepository extends IRepository<Customer> {}
