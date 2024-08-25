import { Test } from '@nestjs/testing';
import { getEntityManagerToken } from '@nestjs/typeorm';
import request from 'supertest';

import { user } from './user.fixture';
import { tag } from '../fixture/tag.fixture';
import { User } from '../../src/users/user.entity';
import { DatasourceModule } from '../../src/datasource/datasource.module';
import { ConfigModule } from '../../src/config/config.module';
import { AuthModule } from '../../src/auth/auth.module';

describe('UsersController (e2e)', () => {
  let manager;
  let app;

  beforeEach(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [ConfigModule, DatasourceModule, AuthModule]
    }).compile();

    manager = moduleFixture.get(getEntityManagerToken());
    app = moduleFixture.createNestApplication();

    await app.init();
  });

  it('/users (GET)', async () => {
    let entity = manager.create(User, user('admin', [tag('a')]));
    await manager.save(entity);
    entity = manager.create(User, user('manager', [tag('b')], entity));
    await manager.save(entity);
    return request(app.getHttpServer())
      .get('/api/users?page=0&size=10&sort=id%2CASC')
      .expect(200)
      .expect(({ body }) => {
        expect(body).toMatchObject({
          content: [
            { id: 'admin', tags: [{ name: 'a' }] },
            { id: 'manager', tags: [{ name: 'b' }], userId: 'admin' }
          ],
          page: { totalElements: 2 }
        });
        body.content.forEach((u) => expect(u).not.toHaveProperty('password'));
      });
  });

  it('/users/search/list (GET)', async () => {
    const entity = manager.create(User, user('manager', [tag('b')]));
    await manager.save(entity);
    return request(app.getHttpServer())
      .get('/api/users/search/list?id=a&page=0&size=10&sort=id%2CASC&tags=b')
      .expect(200)
      .expect(({ body }) => {
        expect(body).toMatchObject({
          content: [{ id: 'manager', tags: [{ name: 'b' }] }],
          page: { totalElements: 1 }
        });
        body.content.forEach((u) => expect(u).not.toHaveProperty('password'));
      });
  });

  it('/users/:id (GET)', async () => {
    let entity = manager.create(User, user('admin', [tag('a')]));
    await manager.save(entity);
    entity = manager.create(User, user('manager', [tag('b')], entity));
    await manager.save(entity);
    return request(app.getHttpServer())
      .get('/api/users/manager')
      .expect(200)
      .expect(({ body }) => {
        expect(body).toMatchObject({
          id: 'manager',
          tags: [{ name: 'b' }],
          userId: 'admin'
        });
        expect(body).not.toHaveProperty('password');
      });
  });

  describe('/users (POST)', () => {
    it('should validate password', async () => {
      const dto = {
        id: 'manager',
        password: 'pass'
      };
      await request(app.getHttpServer())
        .post('/api/users')
        .send(dto)
        .expect(400);
    });

    it('should validate tags', async () => {
      const dto = {
        id: 'manager',
        password: 'password',
        tags: [{ name: '' }]
      };
      await request(app.getHttpServer())
        .post('/api/users')
        .send(dto)
        .expect(400);
    });

    it('should save user', async () => {
      const entity = manager.create(User, user('admin', [tag('a')]));
      await manager.save(entity);
      const dto = {
        id: 'manager',
        password: 'password',
        tags: [
          {
            name: 'b',
            start: '2024-04-19T17:40:00.000Z',
            end: '2024-04-28T17:40:00.000Z'
          }
        ],
        userId: 'admin'
      };
      await request(app.getHttpServer())
        .post('/api/users')
        .send(dto)
        .expect(201);
      const result = await manager.findOne(User, {
        relations: { user: true },
        where: { id: 'manager' }
      });
      expect(result).toMatchObject({
        id: dto.id,
        tags: [
          {
            name: dto.tags[0].name,
            start: new Date(dto.tags[0].start),
            end: new Date(dto.tags[0].end)
          }
        ],
        user: { id: dto.userId }
      });
      expect(result).toHaveProperty('password');
    });
  });

  it('/users/:id (PUT)', async () => {
    let entity = manager.create(User, user('admin', [tag('a')]));
    await manager.save(entity);
    entity = manager.create(User, user('manager'));
    await manager.save(entity);
    const dto = {
      id: 'manager',
      tags: [
        {
          name: 'b'
        }
      ],
      userId: 'admin'
    };
    await request(app.getHttpServer())
      .put('/api/users/manager')
      .send(dto)
      .expect(200);
    const result = await manager.findOne(User, {
      relations: { user: true },
      where: { id: 'manager' }
    });
    expect(result).toMatchObject({
      id: dto.id,
      password: entity.password,
      tags: [
        {
          name: dto.tags[0].name
        }
      ],
      user: { id: dto.userId }
    });
  });

  it('/users/:id (PATCH)', async () => {
    let entity = manager.create(User, user('admin', [tag('a')]));
    await manager.save(entity);
    entity = manager.create(User, user('manager', [tag('b')], entity));
    await manager.save(entity);
    const dto = {
      tags: [{ name: 'c' }]
    };
    await request(app.getHttpServer())
      .patch('/api/users/manager')
      .send(dto)
      .expect(200);
    const result = await manager.findOne(User, {
      relations: { user: true },
      where: { id: 'manager' }
    });
    expect(result).toMatchObject({
      id: entity.id,
      password: entity.password,
      tags: [{ name: dto.tags[0].name }],
      user: { id: entity.user.id }
    });
  });

  it('/users/search/findByIdIn (GET)', async () => {
    let entity = manager.create(User, user('admin', [tag('a')]));
    await manager.save(entity);
    entity = manager.create(User, user('manager', [tag('b')], entity));
    await manager.save(entity);
    return request(app.getHttpServer())
      .get('/api/users/search/findByIdIn?ids=manager')
      .expect(200)
      .expect(({ body }) => {
        expect(body).toMatchObject({
          content: [{ id: 'manager', tags: [{ name: 'b' }], userId: 'admin' }]
        });
        body.content.forEach((u) => expect(u).not.toHaveProperty('password'));
      });
  });

  afterEach(async () => {
    await app.close();
  });
});
