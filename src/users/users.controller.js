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
import { User } from './user.entity';
import { ItemsController } from '../common/controller/items.controller';
import { USERS, USER_TAG } from './constants';
import { ParseUserPipe } from './configuration';
import { EventService } from '../storage/event.service';
import { Roles } from '../auth/roles.decorator';

@Controller(`api/${USERS}`)
@Roles(USER_TAG.MANAGER)
@Dependencies(getCustomRepositoryToken(User), EventService)
export class UsersController extends ItemsController {
  constructor(repository, eventService) {
    super(repository, USERS, eventService);
  }

  @Post()
  @Bind(Body(ParseUserPipe))
  async create(entity) {
    return await super.create(entity);
  }

  @Put(':id')
  @Bind(Param('id'), Body(ParseUserPipe))
  async save(id, entity) {
    return await super.save(id, entity);
  }
}
