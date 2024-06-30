import { ObjectMapper } from './object.mapper';
import { RESOURCE, REFERENCE, NO_FILES } from '../common/entity/constants';

export class UnlinkedMapper extends ObjectMapper {
  constructor(mappingsService) {
    super(mappingsService, [RESOURCE, NO_FILES]);
  }
}

export class ResourceMapper extends ObjectMapper {
  constructor(mappingsService) {
    super(mappingsService, [RESOURCE, REFERENCE, NO_FILES]);
  }
}

export const config = () => ({
  resources: {
    imp: {
      init: process.env.RESOURCES_IMP_INIT === 'true',
      path: process.env.RESOURCES_IMP_PATH
    },
    exp: {
      path: process.env.RESOURCES_EXP_PATH,
      full: {
        cron: process.env.RESOURCES_EXP_FULL_CRON
      },
      inc: {
        cron: process.env.RESOURCES_EXP_INC_CRON,
        ext: process.env.RESOURCES_EXP_INC_EXT
      },
      pattern: process.env.RESOURCES_EXP_PATTERN,
      limit: parseInt(process.env.RESOURCES_EXP_LIMIT, 10)
    }
  }
});
