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

  async transform(item, options = {}) {
    const { repository, type } = this.mappingsService.findByItem(item);
    const result = plainToInstance(type, item, {
      repository,
      groups: [RESOURCE, REFERENCE],
      ...options
    });
    for (const k of Object.keys(result).filter(
      (k) => result[k] instanceof Promise
    )) {
      result[k] = await result[k];
    }
    return result;
  }

  async transformMany(items, options) {
    return await Promise.all(
      items.map(async (item) => await this.transform(item, options))
    );
  }

  push({ queryRunner }, call) {
    if (!queryRunner.q) {
      queryRunner.q = [];
    }
    queryRunner.q.push(call);
  }

  async afterTransactionCommit({ queryRunner }) {
    if (!queryRunner.q) {
      return;
    }
    while (queryRunner.q.length) {
      await queryRunner.q.shift()();
    }
  }

  afterTransactionRollback({ queryRunner }) {
    queryRunner.q = undefined;
  }
}
