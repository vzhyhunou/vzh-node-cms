import {
  Controller,
  Dependencies,
  Put,
  Body,
  Post,
  Bind
} from '@nestjs/common';
import { getCustomRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { ItemsController } from '../common/controller/items.controller';
import { USERS } from './constants';
import { ParseUserPipe } from './configuration';
import { UsersHandler } from './users.handler';

@Controller(`api/${USERS}`)
@Dependencies(getCustomRepositoryToken(User), UsersHandler)
export class UsersController extends ItemsController {
  constructor(repository, usersHandler) {
    super(repository, USERS);
    this.usersHandler = usersHandler;
  }

  @Post()
  @Bind(Body(ParseUserPipe))
  create(entity) {
    this.usersHandler.beforeCreate(entity);
    return super.create(entity);
  }

  @Put(':id')
  @Bind(Body(ParseUserPipe))
  async update(entity) {
    await this.usersHandler.beforeSave(entity);
    return super.save(entity);
  }
}
