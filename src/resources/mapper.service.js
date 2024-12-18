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
    ({ value, obj, options: { mappingsService, groups } }) => {
      const { type, repository } = mappingsService.findByName(obj['@class']);
      return plainToInstance(type, value, { repository, groups });
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

  async resource(file) {
    this.logger.debug(`Read: ${file}`);
    const result = this.resourceMapper.readValue(file, Wrapper).item;
    for (const k of Object.keys(result).filter(
      (k) => result[k] instanceof Promise
    )) {
      result[k] = await result[k];
    }
    return result;
  }

  write(file, item) {
    this.logger.debug(`Write: ${file}`);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    const wrapper = new Wrapper();
    wrapper.item = item;
    this.resourceMapper.writeValue(file, wrapper);
  }
}
