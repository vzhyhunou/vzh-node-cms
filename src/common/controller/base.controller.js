import {
  Get,
  Delete,
  Param,
  Query,
  Bind,
  SerializeOptions,
  UseInterceptors,
  ClassSerializerInterceptor
} from '@nestjs/common';

import { REFERENCE } from '../entity/constants';
import { ItemsInterceptor } from '../interceptor/items.interceptor';

@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({
  groups: [REFERENCE]
})
export class BaseController {
  constructor(repository, resource) {
    this.repository = repository;
    this.resource = resource;
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
  GET http://localhost:3010/api/users/search/list?id=a&page=0&size=10&sort=id%2CASC&tags=MANAGER
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
  @Get('search/list')
  @Bind(Query())
  async list({ page, size, sort, ...rest }) {
    const { content, totalElements } = await this.repository.list(rest, {
      page,
      size,
      sort
    });
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
  GET http://localhost:3010/api/users/search/findByIdIn?ids=manager&ids=editor
  {
    "_embedded" : {
      "users" : [ {
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
  }
  */
  @Get('search/findByIdIn')
  @Bind(Query())
  async findByIdIn({ ids }) {
    const content = await this.repository.findByIdIn(ids);
    return {
      _embedded: {
        [this.resource]: content
      }
    };
  }

  /*
  DELETE http://localhost:3010/api/users/editor
  */
  @Delete(':id')
  @Bind(Param('id'))
  async delete(id) {
    await this.repository.delete(id);
  }
}
