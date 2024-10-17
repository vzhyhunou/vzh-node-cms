import { Transform, Expose } from 'class-transformer';
import { applyDecorators } from '@nestjs/common';
import { In } from 'typeorm';

import { REFERENCE } from '../entity/constants';

export function IdResolve(type, name) {
  return applyDecorators(
    Expose({ name }),
    Transform(
      ({ value, options: { manager } }) =>
        value &&
        (Array.isArray(value)
          ? manager.findBy(type(), { id: In(value) })
          : manager.findOneBy(type(), { id: value })),
      { toClassOnly: true, groups: [REFERENCE] }
    ),
    Transform(
      ({ value }) =>
        value && (Array.isArray(value) ? value.map(({ id }) => id) : value.id),
      {
        toPlainOnly: true,
        groups: [REFERENCE]
      }
    )
  );
}
