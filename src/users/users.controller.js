import {
  Controller,
  Dependencies,
  Put,
  Body,
  Post,
  Bind,
  Param
} from '@nestjs/common';
import { getCustomRepositoryToken } from '@nestjs/typeorm';
import bcrypt from 'bcrypt';
import { User } from './user.entity';
import { ItemsController } from '../common/controller/items.controller';
import { USERS } from './constants';
import { ParseUserPipe } from './configuration';

@Controller(`api/${USERS}`)
@Dependencies(getCustomRepositoryToken(User))
export class UsersController extends ItemsController {
  constructor(repository) {
    super(repository, USERS);
  }

  @Post()
  @Bind(Body(ParseUserPipe))
  create(entity) {
    const { password } = entity;
    entity.password = bcrypt.hashSync(password, 10);
    return super.create(entity);
  }

  @Put(':id')
  @Bind(Param('id'), Body(ParseUserPipe))
  async update(id, entity) {
    const { password } = entity;
    entity.password = password
      ? bcrypt.hashSync(password, 10)
      : await this.repository.findOneBy({ id });
    return super.update(entity);
  }
}
