import { UnitOfWork } from 'src/@core/common/';
import { Customer, CustomerRepository } from '../domain';
import { ListOutput, RegisterOutput } from './dto/CustomerServiceDto';

export class CustomerService {
  constructor(
    private customerRepository: CustomerRepository,
    private unitOfWork: UnitOfWork,
  ) {}

  async register(input: {
    name: string;
    cpf: string;
  }): Promise<RegisterOutput> {
    const customer = Customer.create(input);
    this.customerRepository.add(customer);
    await this.unitOfWork.commit();
    return {
      id: customer.id.value,
      cpf: customer.cpf.value,
      name: customer.name.value,
    };
  }

  async list(): Promise<ListOutput> {
    const customers = await this.customerRepository.findAll();
    return customers.map((customer) => ({
      id: customer.id.value,
      name: customer.name.value,
      cpf: customer.cpf.value,
    }));
  }
}
