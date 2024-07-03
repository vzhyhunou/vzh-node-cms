import {
  Controller,
  Dependencies,
  Put,
  Body,
  Post,
  Bind,
  Request
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
  @Bind(Body(ParseUserPipe), Request())
  async create(entity, req) {
    return await super.create(entity, req);
  }

  @Put(':id')
  @Bind(Body(ParseUserPipe), Request())
  async save(entity, req) {
    return await super.save(entity, req);
  }
}
