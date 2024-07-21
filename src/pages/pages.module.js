import { Module } from '@nestjs/common';
import {
  TypeOrmModule,
  getRepositoryToken,
  getCustomRepositoryToken
} from '@nestjs/typeorm';

import customRepository from './pages.repository';
import { StorageModule } from '../storage/storage.module';
import { Page } from './page.entity';
import { PageTag } from './page-tag.entity';
import { PageTitle } from './page-title.entity';
import { PageContent } from './page-content.entity';
import { PageResource } from './page.resource';
import { PagesController } from './pages.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Page, PageTag, PageTitle, PageContent]),
    StorageModule
  ],
  controllers: [PagesController],
  providers: [
    {
      provide: getCustomRepositoryToken(Page),
      inject: [getRepositoryToken(Page)],
      useFactory: (repository) => repository.extend(customRepository)
    },
    PageResource
  ]
})
export class PagesModule {}
