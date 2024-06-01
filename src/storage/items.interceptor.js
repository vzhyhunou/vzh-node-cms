import { Injectable, Dependencies } from '@nestjs/common';
import { map } from 'rxjs/operators';
import { FileService } from './file.service';
import { LocationService } from './location.service';

@Injectable()
@Dependencies(FileService, LocationService)
export class ItemsInterceptor {
  constructor(fileService, locationService) {
    this.fileService = fileService;
    this.locationService = locationService;
  }

  process(item) {
    item.files = this.fileService.read(
      this.locationService.location(item),
      false
    );
  }

  intercept(context, next) {
    return next.handle().pipe(
      map((data) => {
        if (data) {
          const { _embedded } = data;
          if (_embedded) {
            for (const items of Object.values(_embedded)) {
              for (const item of items) {
                this.process(item);
              }
            }
          } else {
            this.process(data);
          }
        }
        return data;
      })
    );
  }
}
