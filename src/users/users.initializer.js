import { Dependencies, Injectable } from '@nestjs/common';
import { getCustomRepositoryToken } from '@nestjs/typeorm';
import { USERS } from './constants';
import { User } from './user.entity';
import { MappingsService } from '../storage/mappings.service';

@Injectable()
@Dependencies(MappingsService, getCustomRepositoryToken(User))
export class UsersInitializer {
  constructor(mappingsService, repository) {
    mappingsService.add(USERS, User, 'vzh.cms.model.User', repository);
  }
}
