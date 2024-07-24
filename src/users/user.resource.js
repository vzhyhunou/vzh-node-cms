import { Dependencies, Injectable } from '@nestjs/common';

import { USERS } from './constants';
import { User } from './user.entity';
import { MappingsService } from '../storage/mappings.service';

@Injectable()
@Dependencies(MappingsService)
export class UserResource {
  constructor(mappingsService) {
    mappingsService.resources.push({
      resource: USERS,
      type: User,
      name: 'vzh.cms.model.User'
    });
  }
}
