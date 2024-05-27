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
}
