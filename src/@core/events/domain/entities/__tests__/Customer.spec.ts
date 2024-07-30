import { Customer, CustomerId } from '../Customer';
describe('Tests on Customer entity', () => {
  it('should create a client', () => {
    const customer = Customer.create({
      name: 'Alisson',
      cpf: '99346413050',
    });

    expect(customer).toBeInstanceOf(Customer);
    expect(customer.id).toBeDefined();
    expect(customer.id).toBeInstanceOf(CustomerId);
    expect(customer.name.value).toBe('Alisson');
    expect(customer.cpf.value).toBe('99346413050');
  });
});
