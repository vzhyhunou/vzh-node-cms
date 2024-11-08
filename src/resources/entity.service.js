import { Dependencies, Injectable } from '@nestjs/common';

import { MappingsService } from '../storage/mappings.service';

@Injectable()
@Dependencies(MappingsService)
export class EntityService {
  constructor(mappingsService) {
    this.mappingsService = mappingsService;
  }

  async find(item) {
    const { repository } = this.mappingsService.findByItem(item);
    const id = repository.getId(item);
    return await repository.findById(id);
  }

  async create(item) {
    const { repository } = this.mappingsService.findByItem(item);
    await repository.save(item);
  }

  async update(item) {
    item.version = (await this.find(item)).version;
    const { repository } = this.mappingsService.findByItem(item);
    await repository.save(item);
  }

  findAll(type, date) {
    const { repository } = this.mappingsService.findByType(type);
    let index = 0;
    return {
      [Symbol.asyncIterator]() {
        return {
          async next() {
            const value = await repository.findByIndex(index++, date);
            return { value, done: !value };
          }
        };
      }
    };
  }
}
