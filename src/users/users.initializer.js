import { Dependencies, Injectable } from '@nestjs/common';
import { getCustomRepositoryToken } from '@nestjs/typeorm';
import { USERS } from './constants';
import { User } from './user.entity';
import { MappingsService } from '../storage/mappings.service';
import { EventService } from '../storage/event.service';
import { UsersHandler } from './users.handler';

@Injectable()
@Dependencies(
  MappingsService,
  getCustomRepositoryToken(User),
  EventService,
  UsersHandler
)
export class UsersInitializer {
  constructor(mappingsService, repository, eventService, handler) {
    mappingsService.add(USERS, User, 'vzh.cms.model.User', repository);
    eventService.add(handler);
  }
}
