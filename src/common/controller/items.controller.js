import {
  Get,
  Param,
  Bind,
  Patch,
  Body,
  UseInterceptors,
  Request
} from '@nestjs/common';

import { BaseController } from './base.controller';
import { ItemInterceptor } from '../interceptor/item.interceptor';
import { User } from '../../users/user.entity';

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
  @Bind(Param('id'))
  @UseInterceptors(ItemInterceptor)
  async getById(id) {
    return await this.repository.findOne({
      relations: { user: true },
      where: { id }
    });
  }

  /*
  POST http://localhost:3010/api/users
  {"id":"test","password":"12345","tags":[{"name":"MANAGER","start":"2024-04-19T17:40:00.000Z","end":"2024-04-28T17:40:00.000Z"}],"files":[]}
  {
    "id" : "test",
    "date" : "2024-04-19T17:40:54.900+00:00",
    "tags" : [ {
      "name" : "MANAGER",
      "start" : "2024-04-19T17:40:00.000+00:00",
      "end" : "2024-04-28T17:40:00.000+00:00"
    } ],
    "userId" : "admin"
  }
  */
  async create(entity, req) {
    await this.fill(entity, req);
    return await this.repository.save(entity);
  }

  /*
  PUT http://localhost:3010/api/users/manager
  {"id":"manager","tags":[{"name":"MANAGER","start":"2024-04-13T17:44:00.000Z","end":"2024-04-28T17:44:00.000Z"}],"password":"12345","files":[]}
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
  async save(entity, req) {
    await this.fill(entity, req);
    return await this.repository.save(entity);
  }

  /*
  PATCH http://localhost:3010/api/users/editor
  {"tags":[{"name":"PAGES_EDITOR"},{"name":"MANAGER"}]}
  {
    "id" : "editor",
    "date" : "2024-04-24T17:34:47.164+00:00",
    "tags" : [ {
      "name" : "PAGES_EDITOR"
    }, {
      "name" : "MANAGER"
    } ]
  }
  */
  @Patch(':id')
  @Bind(Param('id'), Body(), Request())
  async patch(id, dto, req) {
    let entity = await this.repository.findOneBy({ id });
    entity = this.repository.create({ ...entity, ...dto });
    await this.fill(entity, req);
    return await this.repository.save(entity);
  }

  async fill(item, req) {
    item.date = new Date();
    item.user = await this.repository.manager.findOneBy(User, {
      id: req.getRemoteUser()
    });
  }
}
