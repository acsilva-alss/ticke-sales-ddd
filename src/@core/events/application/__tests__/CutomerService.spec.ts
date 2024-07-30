import { EntityManager, MikroORM, MySqlDriver } from '@mikro-orm/mysql';
import { CustomerSchema } from '../../infra/db/schemas';
import { CustomerRepositoryMySql } from '../../infra/db/repositories/CustomerRepositoryMySql';
import { Customer } from '../../domain';
import { CustomerService } from '../CustomerService';
import { UnitOfWorkMikroOrm } from 'src/@core/common';

describe('Tests on customer service', () => {
  let orm: MikroORM;
  let em: EntityManager;
  let unitOfWork: UnitOfWorkMikroOrm;

  beforeEach(async () => {
    orm = await MikroORM.init<MySqlDriver>({
      entities: [CustomerSchema],
      dbName: 'events',
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: 'root',
      forceEntityConstructor: true,
    });

    await orm.schema.refreshDatabase();
    em = orm.em.fork();
    unitOfWork = new UnitOfWorkMikroOrm(em);
  });

  afterEach(async () => {
    await orm.close();
  });

  it('should register a customer', async () => {
    const customerRepository = new CustomerRepositoryMySql(em);
    const customerService = new CustomerService(customerRepository, unitOfWork);
    const customer = await customerService.register({
      name: 'Customer 1',
      cpf: '02695041098',
    });

    expect(customer.id).toBeDefined();
    expect(customer.name).toBe('Customer 1');
    expect(customer.cpf).toBe('02695041098');
  });

  it('should list the customers', async () => {
    const customerRepository = new CustomerRepositoryMySql(em);
    const customerService = new CustomerService(customerRepository, unitOfWork);
    const customer = Customer.create({
      name: 'Customer 1',
      cpf: '02695041098',
    });
    customerRepository.add(customer);

    await em.flush();
    await em.clear(); // Limpa o cache do entity manager (unit of work)

    const customers = await customerService.list();
    console.log(customers);
    expect(customers[0].id).toBeDefined();
    expect(customers[0].name).toBe('Customer 1');
    expect(customers[0].cpf).toBe('02695041098');
  });
});
