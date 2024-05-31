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
import { UserPipe } from './user.pipe';

@Controller(`api/${USERS}`)
@Dependencies(getCustomRepositoryToken(User))
export class UsersController extends ItemsController {
  constructor(repository) {
    super(repository, USERS);
  }

  @Post()
  @Bind(Body(ParseUserPipe, UserPipe))
  async create(entity) {
    return await super.create(entity);
  }

  @Put(':id')
  @Bind(Body(ParseUserPipe, UserPipe))
  async save(entity) {
    return await super.save(entity);
  }
}
