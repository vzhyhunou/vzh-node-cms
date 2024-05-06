import { Test } from '@nestjs/testing';
import {
  TypeOrmModule,
  getRepositoryToken,
  getDataSourceToken,
  getCustomRepositoryToken
} from '@nestjs/typeorm';
import { User } from '../../src/users/user.entity';
import customRepository from '../../src/users/users.repository';
import { UserTag } from '../../src/users/user-tag.entity';
import { user } from './user.fixture';
import { delayedTag, expiredTag, tag } from '../fixture/tag.fixture';
import { DatabaseModule } from '../../src/database/database.module';
import { ConfigModule } from '../../src/config/config.module';

describe('UsersRepository', () => {
  let manager;
  let subj;

  beforeEach(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [
        ConfigModule,
        DatabaseModule,
        TypeOrmModule.forFeature([User, UserTag])
      ],
      providers: [
        {
          provide: getCustomRepositoryToken(User),
          inject: [getRepositoryToken(User)],
          useFactory: (repository) => repository.extend(customRepository)
        }
      ]
    }).compile();

    manager = moduleFixture.get(getDataSourceToken()).manager;
    subj = moduleFixture.get(getCustomRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(subj).toBeDefined();
  });

  describe('save()', () => {
    it('should create a user', async () => {
      const entity = manager.create(User, user('admin'));
      await subj.save(entity);
      const result = await manager.find(User);
      expect(result).toMatchObject([{ id: 'admin' }]);
    });

    it('should create tags', async () => {
      const entity = manager.create(User, user('admin', [tag('a')]));
      await subj.save(entity);
      const result = await manager.find(UserTag);
      expect(result).toMatchObject([{ name: 'a' }]);
    });
  });

  describe('delete()', () => {
    it('should delete a user', async () => {
      const entity = manager.create(User, user('admin'));
      await manager.save(entity);
      await subj.delete(entity.id);
      const result = await manager.find(User);
      expect(result).toHaveLength(0);
    });

    it('should delete tags', async () => {
      const entity = manager.create(User, user('admin', [tag('a')]));
      await manager.save(entity);
      await subj.delete(entity.id);
      const result = await manager.find(UserTag);
      expect(result).toHaveLength(0);
    });
  });

  describe('findAll()', () => {
    it('should return an array of users', async () => {
      const entities = manager.create(User, [user('admin'), user('manager')]);
      await manager.save(entities);
      let result = await subj.findAll({ page: 0, size: 2 });
      expect(result).toMatchObject({
        content: [{ id: 'admin' }, { id: 'manager' }],
        totalElements: 2
      });
      result = await subj.findAll({ page: 1, size: 2 });
      expect(result).toMatchObject({ content: [], totalElements: 2 });
    });
  });

  describe('list()', () => {
    it('should return an empty array of users', async () => {
      const entities = manager.create(User, [user('admin'), user('manager')]);
      await manager.save(entities);
      const result = await subj.list({ id: 'b' }, { page: 0, size: 1 });
      expect(result).toMatchObject({ content: [], totalElements: 0 });
    });

    it('should return a filtered array of users', async () => {
      const entities = manager.create(User, [user('admin'), user('manager')]);
      await manager.save(entities);
      let result = await subj.list({ id: 'D' }, { page: 0, size: 1 });
      expect(result).toMatchObject({
        content: [{ id: 'admin' }],
        totalElements: 1
      });
      result = await subj.list({ id: 'D' }, { page: 1, size: 1 });
      expect(result).toMatchObject({ content: [], totalElements: 1 });
    });

    it('should return a filtered array of users', async () => {
      const entities = manager.create(User, [user('ADMIN'), user('MANAGER')]);
      await manager.save(entities);
      let result = await subj.list({ id: 'd' }, { page: 0, size: 1 });
      expect(result).toMatchObject({
        content: [{ id: 'ADMIN' }],
        totalElements: 1
      });
      result = await subj.list({ id: 'd' }, { page: 1, size: 1 });
      expect(result).toMatchObject({ content: [], totalElements: 1 });
    });

    it('should return an empty array of users', async () => {
      const entity = manager.create(User, user('admin'));
      await manager.save(entity);
      const result = await subj.list({ tags: ['a'] }, { page: 0, size: 1 });
      expect(result).toMatchObject({ content: [], totalElements: 0 });
    });

    it('should return a filtered array of users', async () => {
      const entities = manager.create(User, [
        user('admin', [tag('a'), tag('b')]),
        user('manager', [tag('c'), tag('d')])
      ]);
      await manager.save(entities);
      let result = await subj.list({ tags: 'a' }, { page: 0, size: 1 });
      expect(result).toMatchObject({
        content: [{ id: 'admin', tags: [{ name: 'a' }, { name: 'b' }] }],
        totalElements: 1
      });
      result = await subj.list({ tags: 'a' }, { page: 1, size: 1 });
      expect(result).toMatchObject({ content: [], totalElements: 1 });
    });

    it('should return a filtered array of users', async () => {
      const entities = manager.create(User, [
        user('admin', [tag('a'), tag('b')]),
        user('manager', [tag('c'), tag('d')])
      ]);
      await manager.save(entities);
      let result = await subj.list({ tags: ['a'] }, { page: 0, size: 1 });
      expect(result).toMatchObject({
        content: [{ id: 'admin', tags: [{ name: 'a' }, { name: 'b' }] }],
        totalElements: 1
      });
      result = await subj.list({ tags: ['a'] }, { page: 1, size: 1 });
      expect(result).toMatchObject({ content: [], totalElements: 1 });
    });

    it('should return an empty array of users', async () => {
      const entities = manager.create(User, [
        user('admin', [tag('a')]),
        user('manager', [tag('c')])
      ]);
      await manager.save(entities);
      const result = await subj.list(
        { id: 'g', tags: ['a'] },
        { page: 0, size: 1 }
      );
      expect(result).toMatchObject({ content: [], totalElements: 0 });
    });
  });

  describe('withActiveRoles()', () => {
    it('should return an user with empty tags', async () => {
      const entities = manager.create(User, [user('admin'), user('manager')]);
      await manager.save(entities);
      const result = await subj.withActiveRoles('admin');
      expect(result).toMatchObject({ id: 'admin', tags: [] });
    });

    it('should return an user with active tag', async () => {
      const entities = manager.create(User, [
        user('admin', [delayedTag('a'), tag('b'), expiredTag('c')]),
        user('manager', [tag('d')])
      ]);
      await manager.save(entities);
      const result = await subj.withActiveRoles('admin');
      expect(result).toMatchObject({ id: 'admin', tags: [{ name: 'b' }] });
    });
  });
});
