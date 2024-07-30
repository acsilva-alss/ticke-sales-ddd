import { MikroORM, MySqlDriver } from '@mikro-orm/mysql';
import { PartnerSchema } from './schemas';
import { Partner } from '../../domain/entities/Partner';

it('should create a partner', async () => {
  const orm = await MikroORM.init<MySqlDriver>({
    entities: [PartnerSchema],
    dbName: 'events',
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    forceEntityConstructor: true,
    //type: 'mysql',
  });

  await orm.schema.refreshDatabase();

  const partner = Partner.create({ name: 'Partner 1' });
  const em = orm.em.fork();
  console.log(partner.id);
  em.persist(partner); // não sobe direto no banco, pois usa unit of work

  await em.flush();
  await em.clear(); // Limpa o cache do entity manager (unit of work)

  const partnerFound = await em.findOne(Partner, { id: partner.id });
  console.log(partnerFound);

  await orm.close();
});
