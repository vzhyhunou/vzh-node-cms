import { Test } from '@nestjs/testing';
import {
  getEntityManagerToken,
  getCustomRepositoryToken
} from '@nestjs/typeorm';
import { DatasourceModule } from '../../src/datasource/datasource.module';
import { ConfigModule } from '../../src/config/config.module';
import { EntityService } from '../../src/resources/entity.service';
import { user } from '../users/user.fixture';
import { User } from '../../src/users/user.entity';
import { MappingsService } from '../../src/storage/mappings.service';
import { UsersModule } from '../../src/users/users.module';

describe('EntityService (e2e)', () => {
  let manager;
  let repository;
  let mappingsService;
  let subj;

  beforeEach(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [ConfigModule, DatasourceModule, UsersModule]
    }).compile();

    manager = moduleFixture.get(getEntityManagerToken());
    repository = moduleFixture.get(getCustomRepositoryToken(User));
    mappingsService = moduleFixture.get(MappingsService);
    subj = new EntityService(mappingsService);
  });

  describe('findAll()', () => {
    it('should find users', async () => {
      const entity = manager.create(User, user('admin'));
      await manager.save(entity);
      const result = subj.findAll(repository);
      const iterator = result[Symbol.asyncIterator]();
      let next = await iterator.next();
      expect(next).toMatchObject({ value: { id: 'admin' }, done: false });
      next = await iterator.next();
      expect(next).toMatchObject({ done: true });
    });

    it('should find users by date', async () => {
      let entity = manager.create(User, user('admin', [], null, new Date(1)));
      await manager.save(entity);
      entity = manager.create(User, user('manager', [], null, new Date(2)));
      await manager.save(entity);
      const result = subj.findAll(repository, new Date(1));
      const iterator = result[Symbol.asyncIterator]();
      let next = await iterator.next();
      expect(next).toMatchObject({ value: { id: 'manager' }, done: false });
      next = await iterator.next();
      expect(next).toMatchObject({ done: true });
    });
  });
});
