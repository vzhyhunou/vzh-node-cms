import { Dependencies, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { plainToInstance } from 'class-transformer';

import { FileService } from './file.service';
import { LocationService } from './location.service';
import { MappingsService } from './mappings.service';
import { REFERENCE, RESOURCE } from '../common/entity/constants';

@Injectable()
@Dependencies(DataSource, FileService, LocationService, MappingsService)
export class StorageSubscriber {
  constructor(dataSource, fileService, locationService, mappingsService, type) {
    dataSource.subscribers.push(this);
    this.fileService = fileService;
    this.locationService = locationService;
    this.mappingsService = mappingsService;
    this.type = type;
  }

  listenTo() {
    return this.type;
  }

  async transform(item) {
    const { repository, type } = this.mappingsService.findByItem(item);
    const result = plainToInstance(type, item, {
      repository,
      groups: [RESOURCE, REFERENCE]
    });
    for (const k of Object.keys(result).filter(
      (k) => result[k] instanceof Promise
    )) {
      result[k] = await result[k];
    }
    return result;
  }

  async transformMany(items) {
    return await Promise.all(
      items.map(async (item) => await this.transform(item))
    );
  }

  save({ queryRunner }, item) {
    queryRunner.item = item;
  }

  restore({ queryRunner }) {
    try {
      return queryRunner.item;
    } finally {
      queryRunner.item = undefined;
    }
  }
}
