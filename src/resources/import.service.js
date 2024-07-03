import { Dependencies, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import path from 'path';
import fs from 'fs';
import { MapperService } from './mapper.service';
import { EntityService } from './entity.service';
import { FileService } from '../storage/file.service';
import { LocationService } from '../storage/location.service';

@Injectable()
@Dependencies(
  ConfigService,
  MapperService,
  EntityService,
  FileService,
  LocationService
)
export class ImportService {
  logger = new Logger(ImportService.name);

  constructor(
    configService,
    mapperService,
    entityService,
    fileService,
    locationService
  ) {
    this.root = configService.get('resources.imp.path');
    this.mapperService = mapperService;
    this.entityService = entityService;
    this.fileService = fileService;
    this.locationService = locationService;
  }

  async imp() {
    if (!fs.existsSync(this.root)) {
      return;
    }
    this.logger.log('Import items with id only');
    await this.consume(this.root, async (f) => {
      const item = this.mapperService.unlinked(f);
      item.files = [];
      await this.entityService.create(item);
    });
    this.logger.log('Import items');
    await this.consume(this.root, async (f) => {
      const item = this.mapperService.resource(f);
      item.files = [];
      await this.entityService.update(item);
    });
    this.logger.log('Import files');
    await this.consume(this.root, async (f) => {
      const item = this.mapperService.resource(f);
      this.fileService.create(
        this.locationService.location(await this.entityService.find(item)),
        item.files
      );
    });
    this.logger.log('End import');
  }

  async consume(dir, consumer) {
    for (const file of fs.readdirSync(dir)) {
      const filepath = path.join(dir, file);
      const stat = fs.statSync(filepath);
      if (stat.isDirectory()) {
        await this.consume(filepath, consumer);
      } else {
        await consumer(filepath);
      }
    }
  }
}
