import { Dependencies } from '@nestjs/common';
import { getCustomRepositoryToken } from '@nestjs/typeorm';
import { REQUEST } from '@nestjs/core';

import { ParseItemPipe } from '../common/pipe/parse-item.pipe';
import { PatchItemPipe } from '../common/pipe/patch-item.pipe';
import { User } from './user.entity';

@Dependencies(getCustomRepositoryToken(User))
export class ParseUserPipe extends ParseItemPipe {
  constructor(repository) {
    super(repository, User);
  }
}

@Dependencies(getCustomRepositoryToken(User), REQUEST)
export class PatchUserPipe extends PatchItemPipe {
  constructor(repository, request) {
    super(repository, request);
  }
}
