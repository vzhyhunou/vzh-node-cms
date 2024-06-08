import { Dependencies, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import path from 'path';
import fs from 'fs';
import moment from 'moment';
import { MapperService } from './mapper.service';
import { EntityService } from './entity.service';
import { FileService } from '../storage/file.service';
import { LocationService } from '../storage/location.service';
import { MappingsService } from '../storage/mappings.service';

@Injectable()
@Dependencies(
  ConfigService,
  MappingsService,
  MapperService,
  EntityService,
  FileService,
  LocationService
)
export class ExportService {
  logger = new Logger(ExportService.name);

  constructor(
    configService,
    mappingsService,
    mapperService,
    entityService,
    fileService,
    locationService
  ) {
    this.properties = configService.get('resources.exp');
    this.ext = this.properties.inc.ext;
    this.mappingsService = mappingsService;
    this.mapperService = mapperService;
    this.entityService = entityService;
    this.fileService = fileService;
    this.locationService = locationService;
  }

  async export(incremental) {
    const last = incremental && this.last();
    const dir = this.folder(!!last);
    this.logger.log(`Start export ${dir} ...`);
    for (const { type } of this.mappingsService.findAll()) {
      for await (const item of this.entityService.findAll(type, last)) {
        const location = this.locationService.location(item);
        item.files = this.fileService.read(location, true);
        this.mapperService.write(path.join(dir, `${location}.json`), item);
      }
    }
    this.logger.log('End export');
    this.clean();
  }

  clean() {
    this.logger.log('Start clean ...');
    const size = this.listFull().length - this.properties.limit;
    if (size > 0) {
      this.deleteFull(size);
      this.deleteIncremental();
    }
    this.logger.log('End clean');
  }

  list() {
    return fs.existsSync(this.properties.path)
      ? fs.readdirSync(this.properties.path)
      : [];
  }

  listFull() {
    return this.list().filter((p) => !p.endsWith(this.ext));
  }

  deleteFull(size) {
    for (const p of this.listFull().sort().slice(0, size)) {
      fs.rmSync(path.join(this.properties.path, p), { recursive: true });
    }
  }

  deleteIncremental() {
    const min = this.listFull().sort()[0];
    for (const p of this.list().filter((p) => (min ? min > p : true))) {
      fs.rmSync(path.join(this.properties.path, p), { recursive: true });
    }
  }

  last() {
    const max = this.listFull().reverse()[0];
    return max && moment(max, this.properties.pattern).toDate();
  }

  folder(incremental) {
    let folder = moment().format(this.properties.pattern);
    if (incremental) {
      folder = `${folder}.${this.ext}`;
    }
    return path.join(this.properties.path, folder);
  }
}
