import { Dependencies, Injectable } from '@nestjs/common';
import { getEntityManagerToken } from '@nestjs/typeorm';

import { MappingsService } from '../storage/mappings.service';

@Injectable()
@Dependencies(MappingsService, getEntityManagerToken())
export class EntityService {
  constructor(mappingsService, manager) {
    this.mappingsService = mappingsService;
    this.manager = manager;
  }

  async find(item) {
    const { type } = this.mappingsService.findByItem(item);
    const id = this.manager.getId(item);
    return await this.manager.findOneBy(type, { id });
  }

  async create(item) {
    await this.manager.save(item);
  }

  async update(item) {
    item.version = (await this.find(item)).version;
    await this.manager.save(item);
  }

  findAll(type, date) {
    const repository = this.manager.getRepository(type);
    let index = 0;
    return {
      [Symbol.asyncIterator]() {
        return {
          async next() {
            const value = await repository.findOneByIndex(index++, date);
            return { value, done: !value };
          }
        };
      }
    };
  }
}
