import { Partner } from '../Partner';

describe('Tests on Partner entity', () => {
  it('should create a event', () => {
    const partner = Partner.create({
      name: 'Alisson Silva',
    });

    const event = partner.initEvent({
      name: 'Evento 1',
      description: 'Descrição do evento',
      date: new Date(),
    });

    expect(event.name).toBe('Evento 1');
  });

  it('should change partner name', () => {
    const partner = Partner.create({
      name: 'Alisson Silva',
    });

    partner.changeName('Alisson Chagas');

    expect(partner.name).toBe('Alisson Chagas');
  });
});
