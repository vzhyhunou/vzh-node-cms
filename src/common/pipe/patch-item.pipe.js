import { Injectable, Scope } from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';

import { RESOURCE, REFERENCE } from '../entity/constants';

@Injectable({ scope: Scope.REQUEST })
export class PatchItemPipe {
  constructor(repository, request) {
    this.repository = repository;
    this.request = request;
  }

  async transform(value) {
    const entity = await this.repository.findById(this.request.params.id);
    return {
      ...instanceToPlain(entity, { groups: [RESOURCE, REFERENCE] }),
      ...value
    };
  }
}
