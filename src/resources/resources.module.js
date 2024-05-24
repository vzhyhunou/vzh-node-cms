import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { StorageModule } from '../storage/storage.module';
import { ImportService } from './import.service';
import { ImportInitializer } from './import.initializer';
import { MapperService } from './mapper.service';
import { EntityService } from './entity.service';
import { ExportScheduler } from './export.scheduler';
import { ExportService } from './export.service';
import { ResourceMapper, UnlinkedMapper } from './configuration';

@Module({
  imports: [ConfigModule, ScheduleModule.forRoot(), StorageModule],
  providers: [
    ImportService,
    ImportInitializer,
    ExportService,
    ExportScheduler,
    UnlinkedMapper,
    ResourceMapper,
    MapperService,
    EntityService
  ]
})
export class ResourcesModule {}
