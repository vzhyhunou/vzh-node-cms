import { Injectable, Dependencies, Scope } from '@nestjs/common';
import { getEntityManagerToken } from '@nestjs/typeorm';
import { REQUEST } from '@nestjs/core';

import { User } from '../users/user.entity';

@Injectable({ scope: Scope.REQUEST })
@Dependencies(getEntityManagerToken(), REQUEST)
export class AuditItemPipe {
  constructor(manager, request) {
    this.manager = manager;
    this.request = request;
  }

  async transform(item) {
    item.date = new Date();
    item.user = await this.manager.findOneBy(User, {
      id: this.request.getRemoteUser()
    });
    return item;
  }
}
