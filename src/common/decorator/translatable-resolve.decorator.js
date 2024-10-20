import { Transform } from 'class-transformer';
import { applyDecorators } from '@nestjs/common';

export function TranslatableResolve(type) {
  return applyDecorators(
    Transform(
      ({ value, options: { manager } }) =>
        Object.entries(value).map(([lang, value]) =>
          manager.create(type(), { lang, value })
        ),
      { toClassOnly: true }
    ),
    Transform(
      ({ value }) =>
        value &&
        Object.fromEntries(value.map(({ lang, value }) => [lang, value])),
      { toPlainOnly: true }
    )
  );
}
