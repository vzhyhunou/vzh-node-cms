import { Dependencies, Injectable } from '@nestjs/common';
import { USERS } from './constants';
import { User } from './user.entity';
import { MappingsService } from '../storage/mappings.service';

@Injectable()
@Dependencies(MappingsService)
export class UsersInitializer {
  constructor(mappingsService) {
    mappingsService.add(USERS, User, 'vzh.cms.model.User');
  }
}
