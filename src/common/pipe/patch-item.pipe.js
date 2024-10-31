import { Injectable, Dependencies, Scope } from '@nestjs/common';
import { getEntityManagerToken } from '@nestjs/typeorm';
import { REQUEST } from '@nestjs/core';
import { instanceToPlain } from 'class-transformer';

import { RESOURCE, REFERENCE } from '../entity/constants';

@Injectable({ scope: Scope.REQUEST })
@Dependencies(getEntityManagerToken(), REQUEST)
export class PatchItemPipe {
  constructor(manager, request, expectedType) {
    this.request = request;
    this.repository = manager.getRepository(expectedType);
  }

  async transform(value) {
    const entity = await this.repository.findOne({
      relations: Object.fromEntries(
        this.repository.getRelationNames().map((name) => [name, true])
      ),
      where: this.request.params
    });
    return {
      ...instanceToPlain(entity, { groups: [RESOURCE, REFERENCE] }),
      ...value
    };
  }
}
