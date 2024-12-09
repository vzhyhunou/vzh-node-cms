import { Transform } from 'class-transformer';
import { applyDecorators } from '@nestjs/common';

export function PairResolve(type) {
  return applyDecorators(
    Transform(
      ({
        value,
        options: {
          repository: { manager }
        }
      }) =>
        value &&
        Object.entries(value).map(([key, value]) =>
          manager.create(type(), { key, value })
        ),
      { toClassOnly: true }
    ),
    Transform(
      ({ value }) =>
        value &&
        Object.fromEntries(value.map(({ key, value }) => [key, value])),
      { toPlainOnly: true }
    )
  );
}
