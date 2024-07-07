import { Injectable, Dependencies, Scope } from '@nestjs/common';
import { getEntityManagerToken } from '@nestjs/typeorm';
import { REQUEST } from '@nestjs/core';

@Injectable({ scope: Scope.REQUEST })
@Dependencies(getEntityManagerToken(), REQUEST)
export class PatchItemPipe {
  constructor(manager, request, expectedType) {
    this.manager = manager;
    this.request = request;
    this.expectedType = expectedType;
  }

  async transform(value) {
    const entity = await this.manager.findOneBy(
      this.expectedType,
      this.request.params
    );
    return { ...entity, ...value };
  }
}
