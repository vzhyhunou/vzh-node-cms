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
  constructor(repository) {
    super(repository);
  }

  /*
  GET http://localhost:3010/api/users?page=0&size=10&sort=id%2CASC
  {
    "content" : [ {
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
    } ],
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
  async findAll({ page = 0, size = 20, sort }) {
    const { content, totalElements } = await this.repository.findAll({
      page,
      size,
      sort: sort && sort.split(',')
    });
    return {
      content,
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
    return await this.repository.findById(id);
  }

  /*
  GET http://localhost:3010/api/users/search/findByIdIn?ids=manager&ids=editor
  {
    "content" : [ {
      "id" : "editor",
      "tags" : [ {
        "name" : "PAGES_EDITOR"
      } ]
    }, {
      "id" : "manager",
      "tags" : [ {
        "name" : "MANAGER"
      } ]
    } ]
  }
  */
  @Get('search/findByIdIn')
  @Bind(Query())
  @UseInterceptors(ItemsInterceptor)
  async findByIdIn({ ids }) {
    const content = await this.repository.findByIdIn(
      typeof ids === 'string' ? [ids] : ids
    );
    return {
      content
    };
  }

  /*
  GET http://localhost:3010/api/users/search/list?id=a&page=0&size=10&sort=id%2CASC&tags=MANAGER
  {
    "content" : [ {
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
    } ],
    "page" : {
      //"size" : 10,
      "totalElements" : 2,
      //"totalPages" : 1,
      //"number" : 0
    }
  }
  */
  @Get('search/list')
  @Bind(Query())
  async list({ page = 0, size = 20, sort, tags, ...rest }) {
    const { content, totalElements } = await this.repository.list(
      { tags: tags && (typeof tags === 'string' ? [tags] : tags), ...rest },
      {
        page,
        size,
        sort: sort && sort.split(',')
      }
    );
    return {
      content,
      page: {
        totalElements
      }
    };
  }
}
