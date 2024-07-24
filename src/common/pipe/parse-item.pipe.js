import { Dependencies, ValidationPipe } from '@nestjs/common';
import { getEntityManagerToken } from '@nestjs/typeorm';
import { RESOURCE, REFERENCE } from '../entity/constants';

@Dependencies(getEntityManagerToken())
export class ParseItemPipe extends ValidationPipe {
  constructor(manager, expectedType) {
    super({
      transform: true,
      expectedType,
      transformOptions: { manager, groups: [RESOURCE, REFERENCE] }
    });
  }

  async transform(value, metadata) {
    const result = await super.transform(value, metadata);
    for (const k of Object.keys(result).filter(
      (k) => result[k] instanceof Promise
    )) {
      result[k] = await this.transform(await result[k], metadata);
    }
    return result;
  }
}
