import { Transform } from 'class-transformer';
import { applyDecorators } from '@nestjs/common';
import { ValidateNested } from 'class-validator';

export function Valid(type) {
  return applyDecorators(
    Transform(
      ({ value, options: { manager } }) =>
        value && manager.create(type(), value),
      { toClassOnly: true }
    ),
    ValidateNested()
  );
}
