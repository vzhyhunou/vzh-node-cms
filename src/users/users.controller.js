import {
  Controller,
  Dependencies,
  Put,
  Patch,
  Delete,
  Body,
  Post,
  Bind,
  Param
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { getCustomRepositoryToken } from '@nestjs/typeorm';

import { User } from './user.entity';
import { USERS, USER_TAG } from './constants';
import { ParseUserPipe, PatchUserPipe } from './configuration';
import { Roles } from '../auth/roles.decorator';
import { AuditItemPipe } from '../auth/audit-item.pipe';
import { ItemsController } from '../common/controller/items.controller';

@Controller(`api/${USERS}`)
@Roles(USER_TAG.MANAGER)
@Dependencies(getCustomRepositoryToken(User), EventEmitter2)
export class UsersController extends ItemsController {
  constructor(repository, eventEmitter) {
    super(repository, eventEmitter, User);
  }

  @Post()
  @Bind(Body(ParseUserPipe, AuditItemPipe))
  async create(entity) {
    return await super.create(entity);
  }

  @Put(':id')
  @Bind(Body(ParseUserPipe, AuditItemPipe))
  async update(entity) {
    return await super.update(entity);
  }

  @Patch(':id')
  @Bind(Body(PatchUserPipe, ParseUserPipe, AuditItemPipe))
  async patch(entity) {
    return await super.update(entity);
  }

  @Delete(':id')
  @Bind(Param('id'))
  async remove(id) {
    await super.remove(id);
  }
}
