import { ObjectMapper } from './object.mapper';
import { RESOURCE, REFERENCE } from '../common/entity/constants';

export class UnlinkedMapper extends ObjectMapper {
  constructor(mappingsService) {
    super(mappingsService, [RESOURCE]);
  }
}

export class ResourceMapper extends ObjectMapper {
  constructor(mappingsService) {
    super(mappingsService, [RESOURCE, REFERENCE]);
  }
}
