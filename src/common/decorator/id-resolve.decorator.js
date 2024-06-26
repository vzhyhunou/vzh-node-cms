import { Transform, Expose } from 'class-transformer';
import { applyDecorators } from '@nestjs/common';
import { REFERENCE } from '../entity/constants';

export function IdResolve(type, name) {
  return applyDecorators(
    Expose({ name }),
    Transform(
      ({ value, options: { manager } }) =>
        value && manager.findOneBy(type(), { id: value }),
      { toClassOnly: true, groups: [REFERENCE] }
    ),
    Transform(({ value }) => value?.id, {
      toPlainOnly: true,
      groups: [REFERENCE]
    })
  );
}
