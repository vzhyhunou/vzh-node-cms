import {
  Get,
  Delete,
  Param,
  Bind,
  SerializeOptions,
  Patch,
  Body,
  UseInterceptors,
  ClassSerializerInterceptor
} from '@nestjs/common';
import { BaseController } from './base.controller';
import { REFERENCE } from '../entity/constants';
import { ItemsInterceptor } from '../../storage/items.interceptor';

@UseInterceptors(ClassSerializerInterceptor, ItemsInterceptor)
export class ItemsController extends BaseController {
  constructor(repository, resource, handler) {
    super(repository, resource);
    this.handler = handler;
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
  async create(entity) {
    this.handler.beforeCreate(entity);
    const item = await this.repository.saveItem(entity);
    this.handler.afterCreate(entity);
    return item;
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
  async save(id, entity) {
    const old = await this.repository.findOneBy({ id });
    this.handler.beforeSave(old, entity);
    const item = await this.repository.saveItem(entity);
    this.handler.afterSave(old, entity);
    return item;
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
  @Bind(Param('id'), Body())
  async patch(id, dto) {
    let entity = await this.repository.findOneBy({ id });
    entity = this.repository.create({ ...entity, ...dto });
    return await this.repository.saveItem(entity);
  }

  /*
  DELETE http://localhost:3010/api/users/editor
  */
  @Delete(':id')
  @Bind(Param('id'))
  async delete(id) {
    const old = await this.repository.findOneBy({ id });
    await this.repository.delete(id);
    this.handler.afterDelete(old);
  }
}
