import { Dependencies, Injectable } from '@nestjs/common';
import { getEntityManagerToken } from '@nestjs/typeorm';
import path from 'path';
import { MappingsService } from './mappings.service';

@Injectable()
@Dependencies(getEntityManagerToken(), MappingsService)
export class LocationService {
  constructor(manager, mappingsService) {
    this.manager = manager;
    this.mappingsService = mappingsService;
  }

  location(item) {
    const { resource } = this.mappingsService.findByType(item.constructor);
    const parents = item.getParents().flatMap((p) => String(p).split('.'));
    const id = String(this.manager.getId(item)).split('.');
    return path.join(resource, ...parents, ...id);
  }
}
