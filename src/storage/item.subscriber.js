import { Dependencies, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { Item } from '../common/entity/item.entity';
import { FileService } from './file.service';
import { LocationService } from './location.service';

@Injectable()
@Dependencies(DataSource, FileService, LocationService)
export class ItemSubscriber {
  constructor(dataSource, fileService, locationService) {
    dataSource.subscribers.push(this);
    this.fileService = fileService;
    this.locationService = locationService;
  }

  listenTo() {
    return Item;
  }

  afterInsert({ entity }) {
    !entity.init && this.fileService.create(
      this.locationService.location(entity),
      entity.files
    );
  }

  afterUpdate({ databaseEntity, entity }) {
    !entity.init && this.fileService.update(
      this.locationService.location(databaseEntity),
      this.locationService.location(entity),
      entity.files
    );
  }

  afterRemove({ databaseEntity }) {
    this.fileService.clean(this.locationService.location(databaseEntity), []);
  }
}
