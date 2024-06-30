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
import { USERS, USER_TAG } from './constants';
import { ParseUserPipe } from './configuration';
import { Roles } from '../auth/roles.decorator';

@Controller(`api/${USERS}`)
@Roles(USER_TAG.MANAGER)
@Dependencies(getCustomRepositoryToken(User))
export class UsersController extends ItemsController {
  constructor(repository) {
    super(repository, USERS);
  }

  @Post()
  @Bind(Body(ParseUserPipe))
  async create(entity) {
    return await super.create(entity);
  }

  @Put(':id')
  @Bind(Body(ParseUserPipe))
  async save(entity) {
    return await super.save(entity);
  }
}
