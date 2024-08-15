import { Test } from '@nestjs/testing';
import { getEntityManagerToken } from '@nestjs/typeorm';
import request from 'supertest';

import { user } from '../users/user.fixture';
import { page } from './page.fixture';
import { tag } from '../fixture/tag.fixture';
import { User } from '../../src/users/user.entity';
import { Page } from '../../src/pages/page.entity';
import { DatasourceModule } from '../../src/datasource/datasource.module';
import { ConfigModule } from '../../src/config/config.module';
import { AuthModule } from '../../src/auth/auth.module';
import { PagesModule } from '../../src/pages/pages.module';
import { I18nModule } from '../../src/i18n/i18n.module';
import { PAGE_TAG } from '../../src/pages/constants';

describe('PagesController (e2e)', () => {
  let manager;
  let app;

  beforeEach(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [
        ConfigModule,
        DatasourceModule,
        AuthModule,
        I18nModule,
        PagesModule
      ]
    }).compile();

    manager = moduleFixture.get(getEntityManagerToken());
    app = moduleFixture.createNestApplication();

    await app.init();
  });

  it('/pages (GET)', async () => {
    let entity = manager.create(Page, page('home', [tag('a')], ['en']));
    await manager.save(entity);
    entity = manager.create(User, user('admin'));
    await manager.save(entity);
    entity = manager.create(Page, page('sample', [tag('b')], ['ru'], entity));
    await manager.save(entity);
    return request(app.getHttpServer())
      .get('/api/pages?page=0&size=10&sort=id%2CASC')
      .expect(200)
      .expect(({ body }) => {
        expect(body).toMatchObject({
          content: [
            {
              id: 'home',
              tags: [{ name: 'a' }],
              title: { en: 'home.en.title' },
              content: { en: 'home.en.content' }
            },
            {
              id: 'sample',
              tags: [{ name: 'b' }],
              title: { ru: 'sample.ru.title' },
              content: { ru: 'sample.ru.content' },
              userId: 'admin'
            }
          ],
          page: { totalElements: 2 }
        });
      });
  });

  it('/pages/search/list (GET)', async () => {
    const entity = manager.create(Page, page('home', [tag('b')], ['en', 'ru']));
    await manager.save(entity);
    return request(app.getHttpServer())
      .get('/api/pages/search/list?id=h&page=0&size=10&sort=id%2CASC&tags=b')
      .set('Accept-Language', 'ru')
      .expect(200)
      .expect(({ body }) => {
        expect(body).toMatchObject({
          content: [
            {
              id: 'home',
              tags: [{ name: 'b' }],
              title: { ru: 'home.ru.title' }
            }
          ],
          page: { totalElements: 1 }
        });
      });
  });

  it('/pages/:id (GET)', async () => {
    let entity = manager.create(Page, page('home', [tag('a')]));
    await manager.save(entity);
    entity = manager.create(User, user('admin'));
    await manager.save(entity);
    entity = manager.create(Page, page('sample', [tag('b')], ['ru'], entity));
    await manager.save(entity);
    return request(app.getHttpServer())
      .get('/api/pages/sample')
      .expect(200)
      .expect(({ body }) => {
        expect(body).toMatchObject({
          id: 'sample',
          tags: [{ name: 'b' }],
          title: { ru: 'sample.ru.title' },
          content: { ru: 'sample.ru.content' },
          userId: 'admin'
        });
      });
  });

  describe('/pages (POST)', () => {
    it('should validate tags', async () => {
      const dto = {
        id: 'home',
        tags: [{ name: '' }]
      };
      await request(app.getHttpServer())
        .post('/api/pages')
        .send(dto)
        .expect(400);
    });

    it('should save page', async () => {
      let entity = manager.create(Page, page('home', [tag('a')]));
      await manager.save(entity);
      entity = manager.create(User, user('admin'));
      await manager.save(entity);
      const dto = {
        id: 'sample',
        tags: [
          {
            name: 'b',
            start: '2024-04-19T17:40:00.000Z',
            end: '2024-04-28T17:40:00.000Z'
          }
        ],
        title: { ru: 'c' },
        content: { ru: 'd' },
        userId: 'admin'
      };
      await request(app.getHttpServer())
        .post('/api/pages')
        .send(dto)
        .expect(201);
      const result = await manager.findOne(Page, {
        relations: { user: true },
        where: { id: 'sample' }
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
        title: Object.entries(dto.title).map(([k, v]) => ({
          lang: k,
          title: v
        })),
        content: Object.entries(dto.content).map(([k, v]) => ({
          lang: k,
          content: v
        })),
        user: { id: dto.userId }
      });
    });
  });

  it('/pages/:id (PUT)', async () => {
    let entity = manager.create(Page, page('home', [tag('a')]));
    await manager.save(entity);
    entity = manager.create(User, user('admin'));
    await manager.save(entity);
    entity = manager.create(Page, page('sample'));
    await manager.save(entity);
    const dto = {
      id: 'sample',
      tags: [
        {
          name: 'b'
        }
      ],
      title: { ru: 'c' },
      content: { ru: 'd' },
      userId: 'admin'
    };
    await request(app.getHttpServer())
      .put('/api/pages/sample')
      .send(dto)
      .expect(200);
    const result = await manager.findOne(Page, {
      relations: { user: true },
      where: { id: 'sample' }
    });
    expect(result).toMatchObject({
      id: dto.id,
      tags: [
        {
          name: dto.tags[0].name
        }
      ],
      title: Object.entries(dto.title).map(([k, v]) => ({
        lang: k,
        title: v
      })),
      content: Object.entries(dto.content).map(([k, v]) => ({
        lang: k,
        content: v
      })),
      user: { id: dto.userId }
    });
  });

  it('/pages/:id (PATCH)', async () => {
    let entity = manager.create(Page, page('home', [tag('a')]));
    await manager.save(entity);
    entity = manager.create(User, user('admin'));
    await manager.save(entity);
    entity = manager.create(Page, page('sample', [tag('b')], [], entity));
    await manager.save(entity);
    const dto = {
      tags: [{ name: 'c' }],
      title: { ru: 'd' },
      content: { ru: 'e' }
    };
    await request(app.getHttpServer())
      .patch('/api/pages/sample')
      .send(dto)
      .expect(200);
    const result = await manager.findOne(Page, {
      relations: { user: true },
      where: { id: 'sample' }
    });
    expect(result).toMatchObject({
      id: entity.id,
      tags: [{ name: dto.tags[0].name }],
      title: Object.entries(dto.title).map(([k, v]) => ({
        lang: k,
        title: v
      })),
      content: Object.entries(dto.content).map(([k, v]) => ({
        lang: k,
        content: v
      })),
      user: { id: entity.user.id }
    });
  });

  it('/pages/search/findByIdIn (GET)', async () => {
    let entity = manager.create(Page, page('home', [tag('a')]));
    await manager.save(entity);
    entity = manager.create(User, user('admin'));
    await manager.save(entity);
    entity = manager.create(Page, page('sample', [tag('b')], ['ru'], entity));
    await manager.save(entity);
    return request(app.getHttpServer())
      .get('/api/pages/search/findByIdIn?ids=sample')
      .expect(200)
      .expect(({ body }) => {
        expect(body).toMatchObject({
          content: [
            {
              id: 'sample',
              tags: [{ name: 'b' }],
              title: { ru: 'sample.ru.title' },
              content: { ru: 'sample.ru.content' },
              userId: 'admin'
            }
          ]
        });
      });
  });

  describe('/pages/search/one/:id (GET)', () => {
    it('should return no object', async () => {
      const entity = manager.create(Page, page('sample', [], ['en']));
      await manager.save(entity);
      return request(app.getHttpServer())
        .get('/api/pages/search/one/sample')
        .expect(200)
        .expect(({ body }) => {
          expect(body).toMatchObject({});
        });
    });

    it('should return an object', async () => {
      let entity = manager.create(Page, page('home'));
      await manager.save(entity);
      entity = manager.create(
        Page,
        page('sample', [tag(PAGE_TAG.PUBLISHED)], ['en'])
      );
      await manager.save(entity);
      return request(app.getHttpServer())
        .get('/api/pages/search/one/sample')
        .expect(200)
        .expect(({ body }) => {
          expect(body).toMatchObject({
            id: 'sample',
            title: 'sample.en.title',
            content: 'sample.en.content',
            files: []
          });
        });
    });

    it('should return no object', async () => {
      const entity = manager.create(
        Page,
        page('sample', [tag(PAGE_TAG.PUBLISHED)], ['en'])
      );
      await manager.save(entity);
      return request(app.getHttpServer())
        .get('/api/pages/search/one/sample')
        .set('Accept-Language', 'ru')
        .expect(200)
        .expect(({ body }) => {
          expect(body).toMatchObject({});
        });
    });

    it('should return an object', async () => {
      let entity = manager.create(Page, page('home'));
      await manager.save(entity);
      entity = manager.create(
        Page,
        page('sample', [tag(PAGE_TAG.PUBLISHED)], ['en', 'ru'])
      );
      await manager.save(entity);
      return request(app.getHttpServer())
        .get('/api/pages/search/one/sample')
        .set('Accept-Language', 'ru')
        .expect(200)
        .expect(({ body }) => {
          expect(body).toMatchObject({
            id: 'sample',
            title: 'sample.ru.title',
            content: 'sample.ru.content',
            files: []
          });
        });
    });
  });

  describe('/pages/search/menu (GET)', () => {
    it('should return an empty array', async () => {
      const entity = manager.create(Page, page('sample', [], ['en']));
      await manager.save(entity);
      return request(app.getHttpServer())
        .get('/api/pages/search/menu')
        .expect(200)
        .expect(({ body }) => {
          expect(body).toHaveLength(0);
        });
    });

    it('should return a filtered array', async () => {
      let entity = manager.create(Page, page('home'));
      await manager.save(entity);
      entity = manager.create(
        Page,
        page('sample', [tag(PAGE_TAG.MENU)], ['en'])
      );
      await manager.save(entity);
      return request(app.getHttpServer())
        .get('/api/pages/search/menu')
        .expect(200)
        .expect(({ body }) => {
          expect(body).toMatchObject([
            {
              id: 'sample',
              title: 'sample.en.title'
            }
          ]);
        });
    });

    it('should return an empty array', async () => {
      const entity = manager.create(
        Page,
        page('sample', [tag(PAGE_TAG.MENU)], ['en'])
      );
      await manager.save(entity);
      return request(app.getHttpServer())
        .get('/api/pages/search/menu')
        .set('Accept-Language', 'ru')
        .expect(200)
        .expect(({ body }) => {
          expect(body).toHaveLength(0);
        });
    });

    it('should return a filtered array', async () => {
      let entity = manager.create(Page, page('home'));
      await manager.save(entity);
      entity = manager.create(
        Page,
        page('sample', [tag(PAGE_TAG.MENU)], ['en', 'ru'])
      );
      await manager.save(entity);
      return request(app.getHttpServer())
        .get('/api/pages/search/menu')
        .set('Accept-Language', 'ru')
        .expect(200)
        .expect(({ body }) => {
          expect(body).toMatchObject([
            {
              id: 'sample',
              title: 'sample.ru.title'
            }
          ]);
        });
    });
  });

  afterEach(async () => {
    await app.close();
  });
});
