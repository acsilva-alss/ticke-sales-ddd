import { EntityManager, MikroORM, MySqlDriver } from '@mikro-orm/mysql';
import { Event, Partner } from 'src/@core/events/domain';
import { PartnerRepositoryMySql } from '../PartnerRepositoryMySql';
import { EventRepositoryMySql } from '../EventRepositoryMySql';
import {
  EventSchema,
  SectionSchema,
  SpotSchema,
  PartnerSchema,
} from '../../schemas';

describe('Tests on event repository', () => {
  let orm: MikroORM;
  let em: EntityManager;

  beforeEach(async () => {
    orm = await MikroORM.init<MySqlDriver>({
      entities: [EventSchema, SectionSchema, SpotSchema, PartnerSchema],
      dbName: 'events',
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: 'root',
      forceEntityConstructor: true,
    });

    await orm.schema.refreshDatabase();
    em = orm.em.fork();
  });

  afterEach(async () => {
    await orm.close();
  });
  it('should add event', async () => {
    const partnerRepository = new PartnerRepositoryMySql(em);
    const eventRepository = new EventRepositoryMySql(em);

    const partner = Partner.create({ name: 'Partner 1' });
    await partnerRepository.add(partner);
    const event = partner.initEvent({
      name: 'Event 1',
      date: new Date(),
      description: 'Event 1 description',
    });

    event.addSection({
      name: 'Section 1',
      description: 'Section 1 description',
      price: 100,
      totalSpots: 1000,
    });

    await eventRepository.add(event);

    await em.flush();
    await em.clear(); // Limpa o cache do entity manager (unit of work)

    const eventFound = await eventRepository.findById(event.id);
    expect(eventFound).toBeInstanceOf(Event);
    expect(eventFound.id).toBeDefined();
    expect(eventFound.name.value).toBe('Event 1');
    expect(eventFound.sections.count()).toBe(1);
    expect(eventFound.totalSpots).toBe(1000);
  });
});
