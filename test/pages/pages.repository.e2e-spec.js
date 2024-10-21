import { Test } from '@nestjs/testing';
import {
  TypeOrmModule,
  getRepositoryToken,
  getEntityManagerToken,
  getCustomRepositoryToken
} from '@nestjs/typeorm';
import { I18nContext } from 'nestjs-i18n';

import { User } from '../../src/users/user.entity';
import { Page } from '../../src/pages/page.entity';
import customRepository from '../../src/pages/pages.repository';
import { UserTag } from '../../src/users/user-tag.entity';
import { PageTag } from '../../src/pages/page-tag.entity';
import { page } from './page.fixture';
import { delayedTag, expiredTag, tag } from '../fixture/tag.fixture';
import { DatasourceModule } from '../../src/datasource/datasource.module';
import { ConfigModule } from '../../src/config/config.module';
import { PageTitle } from '../../src/pages/page-title.entity';
import { PageContent } from '../../src/pages/page-content.entity';
import { PAGE_TAG } from '../../src/pages/constants';

describe('PagesRepository', () => {
  let manager;
  let subj;

  beforeAll(() => {
    I18nContext.current = () => ({ lang: 'en' });
  });

  beforeEach(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [
        ConfigModule,
        DatasourceModule,
        TypeOrmModule.forFeature([
          User,
          UserTag,
          Page,
          PageTag,
          PageTitle,
          PageContent
        ])
      ],
      providers: [
        {
          provide: getCustomRepositoryToken(Page),
          inject: [getRepositoryToken(Page)],
          useFactory: (repository) => repository.extend(customRepository)
        }
      ]
    }).compile();

    manager = moduleFixture.get(getEntityManagerToken());
    subj = moduleFixture.get(getCustomRepositoryToken(Page));
  });

  it('should be defined', () => {
    expect(subj).toBeDefined();
  });

  describe('save()', () => {
    it('should create a page', async () => {
      const entity = manager.create(Page, page('home'));
      await subj.save(entity);
      const result = await manager.find(Page);
      expect(result).toMatchObject([{ id: 'home' }]);
    });

    it('should create tags', async () => {
      const entity = manager.create(Page, page('home', [tag('a')]));
      await subj.save(entity);
      const result = await manager.find(PageTag);
      expect(result).toMatchObject([{ name: 'a' }]);
    });

    it('should update tags', async () => {
      let entity = manager.create(Page, page('home', [tag('a')]));
      await subj.save(entity);
      entity = manager.create(Page, page('home', [tag('b')]));
      await subj.save(entity);
      const result = await manager.find(PageTag);
      expect(result).toMatchObject([{ name: 'b' }]);
    });

    it('should create titles', async () => {
      const entity = manager.create(Page, page('home', [], ['en']));
      await subj.save(entity);
      const result = await manager.find(PageTitle);
      expect(result).toMatchObject([{ key: 'en', value: 'home.en.title' }]);
    });

    it('should update titles', async () => {
      let entity = manager.create(Page, page('home', [], ['en']));
      await subj.save(entity);
      entity = manager.create(Page, page('home', [], ['ru']));
      await subj.save(entity);
      const result = await manager.find(PageTitle);
      expect(result).toMatchObject([{ key: 'ru', value: 'home.ru.title' }]);
    });

    it('should create contents', async () => {
      const entity = manager.create(Page, page('home', [], ['en']));
      await subj.save(entity);
      const result = await manager.find(PageContent);
      expect(result).toMatchObject([{ key: 'en', value: 'home.en.content' }]);
    });

    it('should update contents', async () => {
      let entity = manager.create(Page, page('home', [], ['en']));
      await subj.save(entity);
      entity = manager.create(Page, page('home', [], ['ru']));
      await subj.save(entity);
      const result = await manager.find(PageContent);
      expect(result).toMatchObject([{ key: 'ru', value: 'home.ru.content' }]);
    });
  });

  describe('delete()', () => {
    it('should delete a page', async () => {
      const entity = manager.create(Page, page('home'));
      await manager.save(entity);
      await subj.delete(entity.id);
      const result = await manager.find(Page);
      expect(result).toHaveLength(0);
    });

    it('should delete tags', async () => {
      const entity = manager.create(Page, page('home', [tag('a')]));
      await manager.save(entity);
      await subj.delete(entity.id);
      const result = await manager.find(PageTag);
      expect(result).toHaveLength(0);
    });

    it('should delete titles', async () => {
      const entity = manager.create(Page, page('home', [], ['en']));
      await manager.save(entity);
      await subj.delete(entity.id);
      const result = await manager.find(PageTitle);
      expect(result).toHaveLength(0);
    });

    it('should delete contents', async () => {
      const entity = manager.create(Page, page('home', [], ['en']));
      await manager.save(entity);
      await subj.delete(entity.id);
      const result = await manager.find(PageContent);
      expect(result).toHaveLength(0);
    });
  });

  describe('findAll()', () => {
    it('should return an array of pages', async () => {
      const entities = manager.create(Page, [
        page('home', [tag('a'), tag('b')], ['en', 'ru']),
        page('sample', [tag('c'), tag('d')], ['en', 'ru'])
      ]);
      await manager.save(entities);
      let result = await subj.findAll({ page: 0, size: 2 });
      expect(result).toMatchObject({
        content: [
          {
            id: 'home',
            tags: [{ name: 'a' }, { name: 'b' }],
            title: [
              { key: 'en', value: 'home.en.title' },
              { key: 'ru', value: 'home.ru.title' }
            ],
            content: [
              { key: 'en', value: 'home.en.content' },
              { key: 'ru', value: 'home.ru.content' }
            ]
          },
          {
            id: 'sample',
            tags: [{ name: 'c' }, { name: 'd' }],
            title: [
              { key: 'en', value: 'sample.en.title' },
              { key: 'ru', value: 'sample.ru.title' }
            ],
            content: [
              { key: 'en', value: 'sample.en.content' },
              { key: 'ru', value: 'sample.ru.content' }
            ]
          }
        ],
        totalElements: 2
      });
      result = await subj.findAll({ page: 1, size: 2 });
      expect(result).toMatchObject({ content: [], totalElements: 2 });
    });
  });

  describe('list()', () => {
    it('should return an empty array of pages', async () => {
      const entity = manager.create(Page, page('home'));
      await manager.save(entity);
      const result = await subj.list({ id: 'a' }, { page: 0, size: 1 });
      expect(result).toMatchObject({ content: [], totalElements: 0 });
    });

    it('should return a filtered array of pages', async () => {
      const entities = manager.create(Page, [page('home'), page('sample')]);
      await manager.save(entities);
      let result = await subj.list({ id: 'oM' }, { page: 0, size: 1 });
      expect(result).toMatchObject({
        content: [{ id: 'home' }],
        totalElements: 1
      });
      result = await subj.list({ id: 'oM' }, { page: 1, size: 1 });
      expect(result).toMatchObject({ content: [], totalElements: 1 });
    });

    it('should return an empty array of pages', async () => {
      const entity = manager.create(Page, page('home'));
      await manager.save(entity);
      const result = await subj.list({ tags: ['a'] }, { page: 0, size: 1 });
      expect(result).toMatchObject({ content: [], totalElements: 0 });
    });

    it('should return a filtered array of pages', async () => {
      const entities = manager.create(Page, [
        page('home', [tag('a'), tag('b')]),
        page('sample', [tag('c'), tag('d')])
      ]);
      await manager.save(entities);
      let result = await subj.list({ tags: ['a'] }, { page: 0, size: 1 });
      expect(result).toMatchObject({
        content: [{ id: 'home', tags: [{ name: 'a' }, { name: 'b' }] }],
        totalElements: 1
      });
      result = await subj.list({ tags: ['a'] }, { page: 1, size: 1 });
      expect(result).toMatchObject({ content: [], totalElements: 1 });
    });

    it('should return an empty array of pages', async () => {
      const entity = manager.create(Page, page('home', [], ['en', 'ru']));
      await manager.save(entity);
      const result = await subj.list({ title: 'b' }, { page: 0, size: 1 });
      expect(result).toMatchObject({ content: [], totalElements: 0 });
    });

    it('should return a filtered array of pages', async () => {
      const entities = manager.create(Page, [
        page('home', [], ['en', 'ru']),
        page('sample', [], ['en', 'ru'])
      ]);
      await manager.save(entities);
      let result = await subj.list({ title: 'mE.E' }, { page: 0, size: 1 });
      expect(result).toMatchObject({
        content: [
          { id: 'home', title: [{ key: 'en', value: 'home.en.title' }] }
        ],
        totalElements: 1
      });
      result = await subj.list({ title: 'mE.E' }, { page: 1, size: 1 });
      expect(result).toMatchObject({ content: [], totalElements: 1 });
    });

    it('should return an empty array of pages', async () => {
      const entity = manager.create(Page, page('home', [], ['en', 'ru']));
      await manager.save(entity);
      const result = await subj.list({ content: 'b' }, { page: 0, size: 1 });
      expect(result).toMatchObject({ content: [], totalElements: 0 });
    });

    it('should return a filtered array of pages', async () => {
      const entities = manager.create(Page, [
        page('home', [], ['en', 'ru']),
        page('sample', [], ['en', 'ru'])
      ]);
      await manager.save(entities);
      let result = await subj.list({ content: 'mE.E' }, { page: 0, size: 1 });
      expect(result).toMatchObject({
        content: [
          { id: 'home', title: [{ key: 'en', value: 'home.en.title' }] }
        ],
        totalElements: 1
      });
      result = await subj.list({ content: 'mE.E' }, { page: 1, size: 1 });
      expect(result).toMatchObject({ content: [], totalElements: 1 });
    });

    it('should return an empty array of pages', async () => {
      const entity = manager.create(Page, page('home', [tag('a')], ['en']));
      await manager.save(entity);
      const result = await subj.list(
        { id: 'g', tags: ['a'], title: 'h', content: 'h' },
        { page: 0, size: 1 }
      );
      expect(result).toMatchObject({ content: [], totalElements: 0 });
    });
  });

  describe('one()', () => {
    it('should return no object', async () => {
      const entity = manager.create(Page, page('sample'));
      await manager.save(entity);
      const result = await subj.one('home', true);
      expect(result).toBeNull();
    });

    it('should return no object', async () => {
      const entities = manager.create(Page, [page('home'), page('sample')]);
      await manager.save(entities);
      const result = await subj.one('home', true);
      expect(result).toBeNull();
    });

    it('should return no object', async () => {
      const entities = manager.create(Page, [
        page('home', [], ['ru']),
        page('sample')
      ]);
      await manager.save(entities);
      const result = await subj.one('home', true);
      expect(result).toBeNull();
    });

    it('should return an object', async () => {
      const entities = manager.create(Page, [
        page('home', [], ['en']),
        page('sample')
      ]);
      await manager.save(entities);
      const result = await subj.one('home', true);
      expect(result).toMatchObject({
        id: 'home',
        title: [{ value: 'home.en.title' }],
        content: [{ value: 'home.en.content' }]
      });
    });

    it('should return an object', async () => {
      const entities = manager.create(Page, [
        page('home', [], ['en', 'ru']),
        page('sample')
      ]);
      await manager.save(entities);
      const result = await subj.one('home', true);
      expect(result).toMatchObject({
        id: 'home',
        title: [{ value: 'home.en.title' }],
        content: [{ value: 'home.en.content' }]
      });
    });

    it('should return an object', async () => {
      const entities = manager.create(Page, [
        page('home', [tag(PAGE_TAG.PUBLISHED), tag('b')], ['en', 'ru']),
        page('sample', [tag('a'), tag('b')], ['en', 'ru'])
      ]);
      await manager.save(entities);
      const result = await subj.one('home', false);
      expect(result).toMatchObject({
        id: 'home',
        title: [{ value: 'home.en.title' }],
        content: [{ value: 'home.en.content' }]
      });
    });

    it('should return no object', async () => {
      const entity = manager.create(Page, [
        page('home', [tag('a'), tag('b')], ['en', 'ru'])
      ]);
      await manager.save(entity);
      const result = await subj.one('home', false);
      expect(result).toBeNull();
    });
  });

  describe('menu()', () => {
    it('should return an empty array', async () => {
      const entity = manager.create(
        Page,
        page('home', [tag('a')], ['en', 'ru'])
      );
      await manager.save(entity);
      const result = await subj.menu();
      expect(result).toHaveLength(0);
    });

    it('should return a filtered array', async () => {
      const entity = manager.create(
        Page,
        page('home', [tag(PAGE_TAG.MENU)], ['en', 'ru'])
      );
      await manager.save(entity);
      const result = await subj.menu();
      expect(result).toMatchObject([
        {
          id: 'home',
          title: [{ value: 'home.en.title' }]
        }
      ]);
    });

    it('should return a filtered array', async () => {
      const entities = manager.create(Page, [
        page('home', [], ['en', 'ru']),
        page('test', [tag(PAGE_TAG.MENU)], ['en', 'ru']),
        page('sample', [tag(PAGE_TAG.MENU)], ['en', 'ru']),
        page('sample1', [delayedTag(PAGE_TAG.MENU)], ['en', 'ru']),
        page('sample2', [expiredTag(PAGE_TAG.MENU)], ['en', 'ru'])
      ]);
      await manager.save(entities);
      const result = await subj.menu();
      expect(result).toMatchObject([
        {
          id: 'sample',
          title: [{ value: 'sample.en.title' }]
        },
        {
          id: 'test',
          title: [{ value: 'test.en.title' }]
        }
      ]);
    });
  });
});
