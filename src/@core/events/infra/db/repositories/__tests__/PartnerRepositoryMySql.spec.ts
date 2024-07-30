import { EntityManager, MikroORM, MySqlDriver } from '@mikro-orm/mysql';
import { Partner } from 'src/@core/events/domain';
import { PartnerRepositoryMySql } from '../PartnerRepositoryMySql';
import { PartnerSchema } from '../../schemas';

// CRIAR CLASSE ABSTRATA PARA OS REPOSITÓRIOS QUE SÃO IGUAIS

describe('Tests on partner repository', () => {
  let orm: MikroORM;
  let em: EntityManager;

  beforeEach(async () => {
    orm = await MikroORM.init<MySqlDriver>({
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
    em = orm.em.fork();
  });

  afterEach(async () => {
    await orm.close();
  });

  it('partner repository', async () => {
    const partnerRepo = new PartnerRepositoryMySql(em);

    const partner = Partner.create({ name: 'Partner 1' });
    await partnerRepo.add(partner);

    await em.flush(); // isso não deveria ser no repositório? Não, pois dessa forma o controle transacional fica na camada de aplicação
    em.clear();

    const partnerFound = await partnerRepo.findById(partner.id);

    expect(partnerFound.id.equals(partner.id)).toBeTruthy();
    expect(partnerFound.name.value).toBe(partner.name.value);
    await orm.close();
  });
});
