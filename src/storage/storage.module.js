import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FileService } from './file.service';
import { LocationService } from './location.service';
import { MappingsService } from './mappings.service';

@Module({
  imports: [ConfigModule],
  providers: [FileService, LocationService, MappingsService],
  exports: [FileService, LocationService, MappingsService]
})
export class StorageModule {}
