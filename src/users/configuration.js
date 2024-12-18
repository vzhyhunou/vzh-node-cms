import { Dependencies } from '@nestjs/common';
import { getCustomRepositoryToken } from '@nestjs/typeorm';
import { REQUEST } from '@nestjs/core';

import { ParseItemPipe } from '../common/pipe/parse-item.pipe';
import { PatchItemPipe } from '../common/pipe/patch-item.pipe';
import { User } from './user.entity';
import { FileService } from '../storage/file.service';
import { LocationService } from '../storage/location.service';

@Dependencies(getCustomRepositoryToken(User))
export class ParseUserPipe extends ParseItemPipe {
  constructor(repository) {
    super(repository, User);
  }
}

@Dependencies(
  getCustomRepositoryToken(User),
  FileService,
  LocationService,
  REQUEST
)
export class PatchUserPipe extends PatchItemPipe {
  constructor(repository, fileService, locationService, request) {
    super(repository, fileService, locationService, request);
  }
}
