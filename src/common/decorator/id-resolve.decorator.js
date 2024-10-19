import { Transform, Expose } from 'class-transformer';
import { applyDecorators } from '@nestjs/common';
import { In } from 'typeorm';

import { REFERENCE } from '../entity/constants';

export function IdResolve(type, name) {
  return applyDecorators(
    Expose({ name }),
    Transform(
      ({ value, options: { manager, groups } }) =>
        groups.includes(REFERENCE) && value
          ? Array.isArray(value)
            ? manager.findBy(type(), { id: In(value) })
            : manager.findOneBy(type(), { id: value })
          : undefined,
      { toClassOnly: true }
    ),
    Transform(
      ({ value, options: { groups } }) =>
        groups.includes(REFERENCE) && value
          ? Array.isArray(value)
            ? value.map(({ id }) => id)
            : value.id
          : undefined,
      { toPlainOnly: true }
    )
  );
}
