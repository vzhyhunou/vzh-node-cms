import { Dependencies, Injectable } from '@nestjs/common';
import path from 'path';
import { MappingsService } from './mappings.service';

@Injectable()
@Dependencies(MappingsService)
export class LocationService {
  constructor(mappingsService) {
    this.mappingsService = mappingsService;
  }

  location(item) {
    const { resource, repository } = this.mappingsService.findByItem(item);
    const parents = item.getParents().flatMap((p) => String(p).split('.'));
    const id = String(repository.getId(item)).split('.');
    return path.join(resource, ...parents, ...id);
  }
}
