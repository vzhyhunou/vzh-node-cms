import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FileService } from './file.service';
import { LocationService } from './location.service';
import { MappingsService } from './mappings.service';
import { ItemsHandler } from './items.handler';

@Module({
  imports: [ConfigModule],
  providers: [FileService, LocationService, MappingsService, ItemsHandler],
  exports: [FileService, LocationService, MappingsService, ItemsHandler]
})
export class StorageModule {}
