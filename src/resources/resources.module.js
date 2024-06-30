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
import { ResourceMapper, UnlinkedMapper, config } from './configuration';
import { ImportController } from './import.controller';
import { ExportController } from './export.controller';
import { ObjectMapper } from './object.mapper';

@Module({
  imports: [
    ConfigModule.forFeature(config),
    ScheduleModule.forRoot(),
    StorageModule
  ],
  controllers: [ImportController, ExportController],
  providers: [
    ImportService,
    ImportInitializer,
    ExportService,
    ExportScheduler,
    UnlinkedMapper,
    ResourceMapper,
    ObjectMapper,
    MapperService,
    EntityService
  ]
})
export class ResourcesModule {}
