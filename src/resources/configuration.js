import { ObjectMapper } from './object.mapper';
import { REFERENCE } from '../common/entity/constants';

export class UnlinkedMapper extends ObjectMapper {
  constructor(mappingsService) {
    super(mappingsService, []);
  }
}

export class ResourceMapper extends ObjectMapper {
  constructor(mappingsService) {
    super(mappingsService, [REFERENCE]);
  }
}
