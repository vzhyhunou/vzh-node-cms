import { Injectable } from '@nestjs/common';

@Injectable()
export class MappingsService {
  map = [];

  add(resource, type, name, repository) {
    this.map.push({ type, name, resource, repository });
  }

  findByType(type) {
    return this.map.find((i) => i.type === type);
  }

  findByName(name) {
    return this.map.find((i) => i.name === name);
  }

  findByItem(item) {
    return this.map.find((i) => i.type === item.constructor);
  }

  findAll() {
    return this.map;
  }
}
