import { Test } from '@nestjs/testing';
import {
  TypeOrmModule,
  getRepositoryToken,
  getEntityManagerToken,
  getCustomRepositoryToken
} from '@nestjs/typeorm';

import { User } from '../../src/users/user.entity';
import { Page } from '../../src/pages/page.entity';
import customRepository from '../../src/pages/pages.repository';
import { UserTag } from '../../src/users/user-tag.entity';
import { PageTag } from '../../src/pages/page-tag.entity';
import { page } from './page.fixture';
import { DatasourceModule } from '../../src/datasource/datasource.module';
import { ConfigModule } from '../../src/config/config.module';
import { PageTitle } from '../../src/pages/page-title.entity';
import { PageContent } from '../../src/pages/page-content.entity';
import { ItemSubscriber } from '../../src/storage/item.subscriber';
import { FileService } from '../../src/storage/file.service';
import { LocationService } from '../../src/storage/location.service';
import { MappingsService } from '../../src/storage/mappings.service';
import { PageResource } from '../../src/pages/page.resource';

describe('PagesSubscriber', () => {
  let manager;
  let fileService;
  let subj;

  beforeAll(() => {
    fileService = { create: jest.fn(), update: jest.fn(), clean: jest.fn() };
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
        },
        ItemSubscriber,
        LocationService,
        MappingsService,
        PageResource,
        {
          provide: FileService,
          useValue: fileService
        }
      ]
    }).compile();

    manager = moduleFixture.get(getEntityManagerToken());
    subj = moduleFixture.get(getCustomRepositoryToken(Page));
  });

  it('should be defined', () => {
    expect(subj).toBeDefined();
  });

  describe('insert()', () => {
    it('should create a page', async () => {
      const entity = manager.create(Page, page('home'));
      await subj.save(entity);
      expect(fileService.create).toHaveBeenCalledWith('pages/home', []);
    });
  });

  describe('update()', () => {
    it('should update a page', async () => {
      let entity = manager.create(Page, page('home'));
      await subj.save(entity);
      entity = await manager.findOneBy(Page, { id: 'home' });
      entity.date = new Date();
      await subj.save(entity);
      expect(fileService.update).toHaveBeenCalledWith(
        'pages/home',
        'pages/home',
        []
      );
    });
  });

  describe('remove()', () => {
    it('should delete a page', async () => {
      const entity = manager.create(Page, page('home'));
      await manager.save(entity);
      await subj.remove(entity);
      expect(fileService.clean).toHaveBeenCalledWith('pages/home', []);
    });
  });
});
