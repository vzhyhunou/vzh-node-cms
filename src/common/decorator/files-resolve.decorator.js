import { Transform } from 'class-transformer';
import { applyDecorators } from '@nestjs/common';

import { NO_FILES } from '../entity/constants';

export function FilesResolve() {
  return applyDecorators(
    Transform(() => [], { toClassOnly: true, groups: [NO_FILES] })
  );
}
