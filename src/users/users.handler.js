import { Injectable, Dependencies } from '@nestjs/common';
import { getEntityManagerToken } from '@nestjs/typeorm';
import bcrypt from 'bcrypt';
import { User } from './user.entity';

@Injectable()
@Dependencies(getEntityManagerToken())
export class UsersHandler {
  constructor(manager) {
    this.manager = manager;
  }

  beforeCreate(entity) {
    const { password } = entity;
    entity.password = bcrypt.hashSync(password, 10);
  }

  async beforeSave(entity) {
    const { id, password } = entity;
    entity.password = password
      ? bcrypt.hashSync(password, 10)
      : await this.manager.findOneBy(User, { id });
  }
}
