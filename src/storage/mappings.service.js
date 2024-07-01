import { Injectable } from '@nestjs/common';

@Injectable()
export class MappingsService {
  resources = [];

  findByName(name) {
    return this.resources.find((i) => i.name === name);
  }

  findByItem(item) {
    return this.resources.find((i) => i.type === item.constructor);
  }
}
