import { Dependencies, Injectable } from '@nestjs/common';
import { getCustomRepositoryToken } from '@nestjs/typeorm';

import { USERS } from './constants';
import { User } from './user.entity';
import { MappingsService } from '../storage/mappings.service';

@Injectable()
@Dependencies(MappingsService, getCustomRepositoryToken(User))
export class UserResource {
  constructor(mappingsService, repository) {
    mappingsService.resources.push({
      resource: USERS,
      type: User,
      name: 'vzh.cms.model.User',
      repository
    });
  }
}
