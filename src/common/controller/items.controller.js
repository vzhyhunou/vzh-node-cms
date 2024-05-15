import { Get, Param, Bind, SerializeOptions } from '@nestjs/common';
import { BaseController } from './base.controller';
import { REFERENCE } from '../entity/constants';

export class ItemsController extends BaseController {
  constructor(repository, resource) {
    super(repository, resource);
  }

  /*
  GET http://localhost:3010/api/users/manager
  {
    "id" : "manager",
    "date" : "2024-04-19T17:44:56.242+00:00",
    "tags" : [ {
      "name" : "MANAGER",
      "start" : "2024-04-13T17:44:00.000+00:00",
      "end" : "2024-04-28T17:44:00.000+00:00"
    } ],
    "userId" : "admin"
  }
  */
  @Get(':id')
  @SerializeOptions({
    groups: [REFERENCE]
  })
  @Bind(Param('id'))
  async getById(id) {
    return await this.repository.findOne({
      relations: { user: true },
      where: { id }
    });
  }
}
