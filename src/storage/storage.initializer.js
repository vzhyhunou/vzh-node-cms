import { Dependencies, Injectable } from '@nestjs/common';
import { EventService } from './event.service';
import { ItemsHandler } from './items.handler';

@Injectable()
@Dependencies(EventService, ItemsHandler)
export class StorageInitializer {
  constructor(eventService, handler) {
    eventService.add(handler);
  }
}
