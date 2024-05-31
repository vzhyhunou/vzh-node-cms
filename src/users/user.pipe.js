import { Dependencies, Injectable } from '@nestjs/common';
import { getEntityManagerToken } from '@nestjs/typeorm';
import bcrypt from 'bcrypt';
import { User } from './user.entity';

@Injectable()
@Dependencies(getEntityManagerToken())
export class UserPipe {
  constructor(manager) {
    this.manager = manager;
  }

  async transform(entity) {
    const { id, password } = entity;
    entity.password = password
      ? bcrypt.hashSync(password, 10)
      : (await this.manager.findOneBy(User, { id })).password;
    return entity;
  }
}
