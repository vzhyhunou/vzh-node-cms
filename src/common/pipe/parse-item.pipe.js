import { ValidationPipe } from '@nestjs/common';

import { RESOURCE, REFERENCE } from '../entity/constants';

export class ParseItemPipe extends ValidationPipe {
  constructor(repository, expectedType) {
    super({
      transform: true,
      expectedType,
      transformOptions: { repository, groups: [RESOURCE, REFERENCE] }
    });
  }

  async transform(value, metadata) {
    const result = await super.transform(value, metadata);
    for (const k of Object.keys(result).filter(
      (k) => result[k] instanceof Promise
    )) {
      result[k] = await result[k];
    }
    return result;
  }
}
