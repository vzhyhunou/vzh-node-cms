import {
  Get,
  Param,
  Query,
  Bind,
  SerializeOptions,
  UseInterceptors,
  ClassSerializerInterceptor
} from '@nestjs/common';

import { REFERENCE } from '../entity/constants';
import { ItemsInterceptor } from '../interceptor/items.interceptor';
import { ItemInterceptor } from '../interceptor/item.interceptor';
import { BaseController } from './base.controller';

@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({
  groups: [REFERENCE]
})
export class ItemsController extends BaseController {
  constructor(repository, resource) {
    super(repository, resource);
  }

  /*
  GET http://localhost:3010/api/users?page=0&size=10&sort=id%2CASC
  {
    "_embedded" : {
      "users" : [ {
        "id" : "admin",
        "tags" : [ {
          "name" : "PAGES_EDITOR"
        }, {
          "name" : "MANAGER"
        }, {
          "name" : "ADMIN"
        } ]
      }, {
        "id" : "manager",
        "tags" : [ {
          "name" : "MANAGER"
        } ]
      } ]
    },
    "page" : {
      //"size" : 10,
      "totalElements" : 2,
      //"totalPages" : 1,
      //"number" : 0
    }
  }
  */
  @Get()
  @Bind(Query())
  @UseInterceptors(ItemsInterceptor)
  async findAll(query) {
    const { content, totalElements } = await this.repository.findAll(query);
    return {
      _embedded: {
        [this.resource]: content
      },
      page: {
        totalElements
      }
    };
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
    const { relations, primaryColumns } = this.repository.metadata;
    return await this.repository.findOne({
      relations: Object.fromEntries(
        relations.map(({ propertyName }) => [propertyName, true])
      ),
      where: { [primaryColumns[0].propertyName]: id }
    });
  }
}
