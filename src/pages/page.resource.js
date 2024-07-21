import { Dependencies, Injectable } from '@nestjs/common';

import { PAGES } from './constants';
import { Page } from './page.entity';
import { MappingsService } from '../storage/mappings.service';

@Injectable()
@Dependencies(MappingsService)
export class PageResource {
  constructor(mappingsService) {
    mappingsService.resources.push({
      resource: PAGES,
      type: Page,
      name: 'vzh.cms.model.Page'
    });
  }
}
