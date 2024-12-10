import { Dependencies, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { plainToInstance } from 'class-transformer';

import { Item } from '../common/entity/item.entity';
import { FileService } from './file.service';
import { LocationService } from './location.service';
import { MappingsService } from './mappings.service';
import { REFERENCE, RESOURCE } from '../common/entity/constants';

@Injectable()
@Dependencies(DataSource, FileService, LocationService, MappingsService)
export class ItemSubscriber {
  constructor(dataSource, fileService, locationService, mappingsService) {
    dataSource.subscribers.push(this);
    this.fileService = fileService;
    this.locationService = locationService;
    this.mappingsService = mappingsService;
  }

  listenTo() {
    return Item;
  }

  async before(e, databaseEntity) {
    const { repository, type } =
      this.mappingsService.findByItem(databaseEntity);
    const result = plainToInstance(type, databaseEntity, {
      repository,
      groups: [RESOURCE, REFERENCE]
    });
    for (const k of Object.keys(result).filter(
      (k) => result[k] instanceof Promise
    )) {
      result[k] = await result[k];
    }
    e.location = this.locationService.location(result);
  }

  afterInsert({ entity }) {
    const { init } = entity;
    if (init) {
      return;
    }
    this.fileService.create(
      this.locationService.location(entity),
      entity.files
    );
  }

  async beforeUpdate({ entity: { init }, databaseEntity, queryRunner }) {
    if (init) {
      return;
    }
    await this.before(queryRunner, databaseEntity);
  }

  afterUpdate({ entity, queryRunner }) {
    const { location } = queryRunner;
    if (!location) {
      return;
    }
    this.fileService.update(
      location,
      this.locationService.location(entity),
      entity.files
    );
    queryRunner.location = undefined;
  }

  async beforeRemove({ entity: { init }, databaseEntity, queryRunner }) {
    if (init) {
      return;
    }
    await this.before(queryRunner, databaseEntity);
  }

  afterRemove({ queryRunner }) {
    const { location } = queryRunner;
    if (!location) {
      return;
    }
    this.fileService.clean(location, []);
    queryRunner.location = undefined;
  }
}
