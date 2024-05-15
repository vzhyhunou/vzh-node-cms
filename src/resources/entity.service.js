import { Dependencies, Injectable } from '@nestjs/common';
import { getEntityManagerToken } from '@nestjs/typeorm';

@Injectable()
@Dependencies(getEntityManagerToken())
export class EntityService {
  constructor(manager) {
    this.manager = manager;
  }

  async find(item) {
    const id = this.manager.getId(item);
    return await this.manager.findOneBy(item.constructor, { id });
  }

  async create(item) {
    await this.manager.save(item);
  }

  async update(item) {
    item.version = (await this.find(item)).version;
    await this.manager.save(item);
  }
}
