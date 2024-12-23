import { Dependencies, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { FileService } from './file.service';
import { LocationService } from './location.service';

@Injectable()
@Dependencies(FileService, LocationService)
export class ItemListener {
  constructor(fileService, locationService) {
    this.fileService = fileService;
    this.locationService = locationService;
  }

  @OnEvent('after.created.*')
  afterCreated({ entity }) {
    this.fileService.create(
      this.locationService.location(entity),
      entity.files
    );
  }

  @OnEvent('after.updated.*')
  afterUpdated({ entity, databaseEntity }) {
    this.fileService.update(
      this.locationService.location(databaseEntity),
      this.locationService.location(entity),
      entity.files
    );
  }

  @OnEvent('after.removed.*')
  afterRemoved({ databaseEntity }) {
    this.fileService.clean(this.locationService.location(databaseEntity), []);
  }
}
