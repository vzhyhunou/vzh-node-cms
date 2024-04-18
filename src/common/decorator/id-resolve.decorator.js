import { Transform, Expose } from 'class-transformer';
import { applyDecorators } from '@nestjs/common';

export function IdResolve(type, name) {
  return applyDecorators(
    Expose({ name }),
    /*
      move to manager.findOneBy after next issues resolving:
      https://github.com/typeorm/typeorm/issues/2276
      https://github.com/typeorm/typeorm/issues/5935
    */
    Transform(
      ({ value, options: { manager } }) =>
        value && manager.create(type(), { id: value }),
      { toClassOnly: true }
    ),
    Transform(({ value }) => value?.id, { toPlainOnly: true })
  );
}
