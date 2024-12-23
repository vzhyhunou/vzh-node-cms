import { Dependencies } from '@nestjs/common';
import { getCustomRepositoryToken } from '@nestjs/typeorm';
import { REQUEST } from '@nestjs/core';

import { ParseItemPipe } from '../common/pipe/parse-item.pipe';
import { PatchItemPipe } from '../common/pipe/patch-item.pipe';
import { Page } from './page.entity';
import { FileService } from '../storage/file.service';
import { LocationService } from '../storage/location.service';

@Dependencies(getCustomRepositoryToken(Page))
export class ParsePagePipe extends ParseItemPipe {
  constructor(repository) {
    super(repository, Page);
  }
}

@Dependencies(
  getCustomRepositoryToken(Page),
  FileService,
  LocationService,
  REQUEST
)
export class PatchPagePipe extends PatchItemPipe {
  constructor(repository, fileService, locationService, request) {
    super(repository, fileService, locationService, request);
  }
}
