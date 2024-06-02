import { Injectable, Dependencies } from '@nestjs/common';
import { FileService } from './file.service';
import { LocationService } from './location.service';

@Injectable()
@Dependencies(FileService, LocationService)
export class ItemsHandler {
  constructor(fileService, locationService) {
    this.fileService = fileService;
    this.locationService = locationService;
  }

  afterCreate(item) {
    this.fileService.create(this.locationService.location(item), item.files);
  }

  afterSave(oldItem, newItem) {
    this.fileService.update(
      this.locationService.location(oldItem),
      this.locationService.location(newItem),
      newItem.files
    );
  }

  afterDelete(item) {
    this.fileService.clean(this.locationService.location(item), []);
  }
}
