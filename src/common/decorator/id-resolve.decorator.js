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
            ? (async () =>
                ((items) =>
                  value.map((id) => items.find((item) => id === item.id)))(
                  await manager.findBy(type(), { id: In(value) })
                ))()
            : manager.findOneBy(type(), { id: value })
          : value,
      { toClassOnly: true }
    ),
    Transform(
      ({ value, options: { groups } }) =>
        groups.includes(REFERENCE) && value
          ? Array.isArray(value)
            ? value.map(({ id }) => id)
            : value.id
          : value,
      { toPlainOnly: true }
    )
  );
}
