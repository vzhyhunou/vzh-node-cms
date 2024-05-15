import { Injectable } from '@nestjs/common';

@Injectable()
export class MappingsService {
  map = [];

  add(resource, type, name) {
    this.map.push({ type, name, resource });
  }

  findByType(type) {
    return this.map.find((i) => i.type === type);
  }

  findByName(name) {
    return this.map.find((i) => i.name === name);
  }
}
