import { Dependencies, ValidationPipe } from '@nestjs/common';
import { getDataSourceToken } from '@nestjs/typeorm';
import { RESOURCE } from '../entity/item.entity';

@Dependencies(getDataSourceToken())
export class ParseEntityPipe extends ValidationPipe {
  constructor({ manager }, expectedType) {
    super({
      transform: true,
      expectedType,
      transformOptions: { manager, groups: [RESOURCE] }
    });
  }
}
