import { Transform } from 'class-transformer';
import { applyDecorators } from '@nestjs/common';

export function TranslatableResolve(type, name, column) {
  return applyDecorators(
    Transform(
      ({ value, options: { manager } }) =>
        Object.entries(value).map(([k, v]) =>
          manager.create(type(), { lang: k, [column]: v })
        ),
      { toClassOnly: true }
    ),
    Transform(
      ({ value }) =>
        value && Object.fromEntries(value.map((v) => [v.lang, v[column]])),
      { toPlainOnly: true }
    )
  );
}
