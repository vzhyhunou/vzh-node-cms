import { Dependencies, Injectable } from '@nestjs/common';
import { getCustomRepositoryToken } from '@nestjs/typeorm';

import { PAGES } from './constants';
import { Page } from './page.entity';
import { MappingsService } from '../storage/mappings.service';

@Injectable()
@Dependencies(MappingsService, getCustomRepositoryToken(Page))
export class PageResource {
  constructor(mappingsService, repository) {
    mappingsService.resources.push({
      resource: PAGES,
      type: Page,
      name: 'vzh.cms.model.Page',
      repository
    });
  }
}
