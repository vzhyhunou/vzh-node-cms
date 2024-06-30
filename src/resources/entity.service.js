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
    return await repository.findOneBy({ id });
  }

  async create(item) {
    const { repository } = this.mappingsService.findByItem(item);
    await repository.saveItem(item);
  }

  async update(item) {
    item.version = (await this.find(item)).version;
    const { repository } = this.mappingsService.findByItem(item);
    await repository.saveItem(item);
  }

  findAll(repository, date) {
    let index = 0;
    return {
      [Symbol.asyncIterator]() {
        return {
          async next() {
            const q = repository.createQueryBuilderWithRelations('item');
            if (date) {
              q.where('item.date > :date', { date });
            }
            const value = await q.skip(index++).take(1).getOne();
            return { value, done: !value };
          }
        };
      }
    };
  }
}
