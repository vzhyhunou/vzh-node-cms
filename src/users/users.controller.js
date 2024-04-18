import {
  Controller,
  Dependencies,
  Put,
  Body,
  Post,
  Bind
} from '@nestjs/common';
import { ParseUserPipe } from '../users/parse-user.pipe';
import { getCustomRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { ItemsController } from '../common/controller/items.controller';

@Controller('users')
@Dependencies(getCustomRepositoryToken(User))
export class UsersController extends ItemsController {
  constructor(repository) {
    super(repository, 'users');
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
