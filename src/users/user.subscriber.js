import { Dependencies, Injectable } from '@nestjs/common';
import { EventSubscriber, DataSource } from 'typeorm';
import bcrypt from 'bcrypt';

import { User } from './user.entity';

@Injectable()
@Dependencies(DataSource)
@EventSubscriber()
export class UserSubscriber {
  constructor(dataSource) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return User;
  }

  beforeInsert({ entity }) {
    entity.password = bcrypt.hashSync(entity.password, 10);
  }

  beforeUpdate({ databaseEntity, entity }) {
    entity.password =
      entity.password && databaseEntity.password !== entity.password
        ? bcrypt.hashSync(entity.password, 10)
        : databaseEntity.password;
  }
}
