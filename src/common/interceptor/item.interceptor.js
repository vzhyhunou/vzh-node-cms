import { Dependencies } from '@nestjs/common';

import { FileService } from '../../storage/file.service';
import { LocationService } from '../../storage/location.service';
import { BaseInterceptor } from './base.interceptor';

@Dependencies(FileService, LocationService)
export class ItemInterceptor extends BaseInterceptor {
  constructor(fileService, locationService) {
    super();
    this.fileService = fileService;
    this.locationService = locationService;
  }

  process(item) {
    item.files = this.fileService.read(
      this.locationService.location(item),
      false
    );
    return item;
  }
}
