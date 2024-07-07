import {
  Controller,
  Dependencies,
  Put,
  Patch,
  Body,
  Post,
  Bind
} from '@nestjs/common';
import { getCustomRepositoryToken } from '@nestjs/typeorm';

import { User } from './user.entity';
import { BaseController } from '../common/controller/base.controller';
import { USERS, USER_TAG } from './constants';
import { ParseUserPipe, PatchUserPipe } from './configuration';
import { Roles } from '../auth/roles.decorator';
import { AuditItemPipe } from '../auth/audit-item.pipe';

@Controller(`api/${USERS}`)
@Roles(USER_TAG.MANAGER)
@Dependencies(getCustomRepositoryToken(User))
export class UsersController extends BaseController {
  constructor(repository) {
    super(repository, USERS);
  }

  @Post()
  @Bind(Body(ParseUserPipe, AuditItemPipe))
  async create(entity) {
    return await super.create(entity);
  }

  @Put(':id')
  @Bind(Body(ParseUserPipe, AuditItemPipe))
  async save(entity) {
    return await super.save(entity);
  }

  @Patch(':id')
  @Bind(Body(PatchUserPipe, ParseUserPipe, AuditItemPipe))
  async patch(entity) {
    return await super.patch(entity);
  }
}
