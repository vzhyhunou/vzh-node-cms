import { Dependencies, Injectable } from '@nestjs/common';
import { getEntityManagerToken } from '@nestjs/typeorm';
import path from 'path';

import { MappingsService } from './mappings.service';

@Injectable()
@Dependencies(MappingsService, getEntityManagerToken())
export class LocationService {
  constructor(mappingsService, manager) {
    this.mappingsService = mappingsService;
    this.manager = manager;
  }

  location(item) {
    const { resource } = this.mappingsService.findByItem(item);
    const parents = item.getParents().flatMap((p) => String(p).split('.'));
    const id = String(this.manager.getId(item)).split('.');
    return path.join(resource, ...parents, ...id);
  }
}
