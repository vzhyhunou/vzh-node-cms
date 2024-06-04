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

export const config = () => ({
  imp: {
    init: process.env.CMS_IMP_INIT === 'true',
    path: process.env.CMS_IMP_PATH
  },
  exp: {
    path: process.env.CMS_EXP_PATH,
    full: {
      cron: process.env.CMS_EXP_FULL_CRON
    },
    inc: {
      cron: process.env.CMS_EXP_INC_CRON,
      ext: process.env.CMS_EXP_INC_EXT
    },
    pattern: process.env.CMS_EXP_PATTERN,
    limit: parseInt(process.env.CMS_EXP_LIMIT, 10)
  }
});
