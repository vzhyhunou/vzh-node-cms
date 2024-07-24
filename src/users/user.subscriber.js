import { Dependencies, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import bcrypt from 'bcrypt';

import { User } from './user.entity';

const PATTERN = /^\$2[ayb]\$.{56}$/;

@Injectable()
@Dependencies(DataSource)
export class UserSubscriber {
  constructor(dataSource) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return User;
  }

  beforeInsert({ entity }) {
    if (!PATTERN.test(entity.password)) {
      entity.password = bcrypt.hashSync(entity.password, 10);
    }
  }

  beforeUpdate({ databaseEntity, entity }) {
    if (!entity.password) {
      entity.password = databaseEntity.password;
    } else if (!PATTERN.test(entity.password)) {
      entity.password = bcrypt.hashSync(entity.password, 10);
    }
  }
}
