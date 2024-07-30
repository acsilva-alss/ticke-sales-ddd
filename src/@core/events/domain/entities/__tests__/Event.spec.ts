import { Event } from '../Event';
import { PartnerId } from '../Partner';

describe('Tests on Event entity', () => {
  it('should create a Event', () => {
    const event = Event.create({
      name: 'Evento 1',
      description: 'Descrição do evento 1',
      date: new Date(),
      partnerId: new PartnerId(),
    });

    event.addSection({
      name: 'Arquibancada norte',
      description: 'Ultimo anel',
      totalSpots: 100,
      price: 1000,
    });
    const [section] = event.sections;
    expect(event.sections.count()).toBe(1);
    expect(event.totalSpots).toBe(100);
    expect(section.spots.count()).toBe(100);
  });

  it('should published all event items a Event', () => {
    const event = Event.create({
      name: 'Evento 1',
      description: 'Descrição do evento 1',
      date: new Date(),
      partnerId: new PartnerId(),
    });

    event.addSection({
      name: 'Arquibancada norte',
      description: 'Ultimo anel',
      totalSpots: 100,
      price: 1000,
    });

    event.addSection({
      name: 'Arquibancada sul',
      description: 'Ultimo anel',
      totalSpots: 1000,
      price: 50,
    });

    event.publishAll();

    expect(event.isPublished).toBeTruthy();

    const [section1, section2] = event.sections.getItems();

    expect(section1.isPublished).toBeTruthy();
    expect(section2.isPublished).toBeTruthy();

    section1.spots.forEach((spot) => {
      expect(spot.isPublished).toBeTruthy();
    });

    [...section1.spots, ...section2.spots].forEach((spot) => {
      expect(spot.isPublished).toBeTruthy();
    });
  });
});
