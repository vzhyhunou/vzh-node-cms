import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { FileService } from './file.service';
import { LocationService } from './location.service';
import { MappingsService } from './mappings.service';
import { config } from './configuration';
import { ItemSubscriber } from './item.subscriber';

@Module({
  imports: [ConfigModule.forFeature(config)],
  providers: [FileService, LocationService, MappingsService, ItemSubscriber],
  exports: [FileService, LocationService, MappingsService]
})
export class StorageModule {}
