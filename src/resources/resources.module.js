import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StorageModule } from '../storage/storage.module';
import { ImportService } from './import.service';
import { ImportInitializer } from './import.initializer';
import {
  MapperService,
  ResourceMapper,
  UnlinkedMapper
} from './mapper.service';
import { EntityService } from './entity.service';

@Module({
  imports: [ConfigModule, StorageModule],
  providers: [
    ImportService,
    ImportInitializer,
    UnlinkedMapper,
    ResourceMapper,
    MapperService,
    EntityService
  ]
})
export class ResourcesModule {}
