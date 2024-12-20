import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import bcrypt from 'bcrypt';

const PATTERN = /^\$2[ayb]\$.{56}$/;

@Injectable()
export class UserListener {
  constructor(fileService, locationService) {
    this.fileService = fileService;
    this.locationService = locationService;
  }

  @OnEvent('before.created.user')
  beforeCreated({ entity }) {
    if (!PATTERN.test(entity.password)) {
      entity.password = bcrypt.hashSync(entity.password, 10);
    }
  }

  @OnEvent('before.updated.user')
  beforeUpdated({ entity, databaseEntity }) {
    if (!entity.password) {
      entity.password = databaseEntity.password;
    } else if (!PATTERN.test(entity.password)) {
      entity.password = bcrypt.hashSync(entity.password, 10);
    }
  }
}
