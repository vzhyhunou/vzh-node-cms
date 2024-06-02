import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FileService } from './file.service';
import { LocationService } from './location.service';
import { MappingsService } from './mappings.service';
import { ItemsHandler } from './items.handler';
import { EventService } from './event.service';
import { StorageInitializer } from './storage.initializer';

@Module({
  imports: [ConfigModule],
  providers: [
    FileService,
    LocationService,
    MappingsService,
    EventService,
    ItemsHandler,
    StorageInitializer
  ],
  exports: [FileService, LocationService, MappingsService, EventService]
})
export class StorageModule {}
