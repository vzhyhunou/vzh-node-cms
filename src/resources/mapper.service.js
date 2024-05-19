import { Injectable, Dependencies, Logger } from '@nestjs/common';
import { Transform, plainToInstance } from 'class-transformer';
import { ObjectMapper } from './object.mapper';
import { REFERENCE } from '../common/entity/constants';

export class UnlinkedMapper extends ObjectMapper {
  constructor(manager, mappingsService) {
    super(manager, mappingsService, []);
  }
}

export class ResourceMapper extends ObjectMapper {
  constructor(manager, mappingsService) {
    super(manager, mappingsService, [REFERENCE]);
  }
}

class Wrapper {
  '@class';

  @Transform(
    ({ value, obj, options: { mappingsService } }) => {
      const { type } = mappingsService.findByName(obj['@class']);
      return plainToInstance(type, value);
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
    // todo
  }
}
