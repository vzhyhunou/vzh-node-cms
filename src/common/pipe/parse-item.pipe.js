import { Dependencies, ValidationPipe } from '@nestjs/common';
import { getEntityManagerToken } from '@nestjs/typeorm';

@Dependencies(getEntityManagerToken())
export class ParseItemPipe extends ValidationPipe {
  constructor(manager, expectedType, groups) {
    super({
      transform: true,
      expectedType,
      transformOptions: { manager, groups }
    });
  }
}
