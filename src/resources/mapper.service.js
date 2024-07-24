import { Injectable, Dependencies, Logger } from '@nestjs/common';
import { Transform, plainToInstance } from 'class-transformer';
import path from 'path';
import fs from 'fs';

import { ResourceMapper, UnlinkedMapper } from './configuration';

class Wrapper {
  @Transform(
    ({ obj: { item }, options: { mappingsService } }) => {
      const { name } = mappingsService.findByItem(item);
      return name;
    },
    { toPlainOnly: true }
  )
  '@class';

  @Transform(
    ({ value, obj, options: { manager, mappingsService, groups } }) => {
      const { type } = mappingsService.findByName(obj['@class']);
      return plainToInstance(type, value, { manager, groups });
    },
    { toClassOnly: true }
  )
  item;
}

@Injectable()
@Dependencies(UnlinkedMapper, ResourceMapper)
export class MapperService {
  logger = new Logger(MapperService.name);

  constructor(unlinkedMapper, resourceMapper) {
    this.unlinkedMapper = unlinkedMapper;
    this.resourceMapper = resourceMapper;
  }

  unlinked(file) {
    this.logger.debug(`Read: ${file}`);
    return this.unlinkedMapper.readValue(file, Wrapper).item;
  }

  resource(file) {
    this.logger.debug(`Read: ${file}`);
    return this.resourceMapper.readValue(file, Wrapper).item;
  }

  write(file, item) {
    this.logger.debug(`Write: ${file}`);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    const wrapper = new Wrapper();
    wrapper.item = item;
    this.resourceMapper.writeValue(file, wrapper);
  }
}
