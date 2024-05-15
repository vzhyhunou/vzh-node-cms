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
import { ParseItemPipe } from '../common/pipe/parse-item.pipe';
import { REFERENCE } from '../common/entity/constants';

class ParseUserPipe extends ParseItemPipe {
  constructor(manager) {
    super(manager, User, [REFERENCE]);
  }
}

@Controller(USERS)
@Dependencies(getCustomRepositoryToken(User))
export class UsersController extends ItemsController {
  constructor(repository) {
    super(repository, USERS);
  }

  @Post()
  @Bind(Body(ParseUserPipe))
  create(entity) {
    return super.create(entity);
  }

  @Put(':id')
  @Bind(Body(ParseUserPipe))
  update(entity) {
    return super.update(entity);
  }
}
