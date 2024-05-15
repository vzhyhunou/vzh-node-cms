import {
  Get,
  Query,
  Bind,
  UseInterceptors,
  ClassSerializerInterceptor,
  Patch,
  Body,
  Delete,
  Param,
  SerializeOptions
} from '@nestjs/common';
import { REFERENCE } from '../entity/constants';

@UseInterceptors(ClassSerializerInterceptor)
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
  @SerializeOptions({
    groups: [REFERENCE]
  })
  @Bind(Query())
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
  @SerializeOptions({
    groups: [REFERENCE]
  })
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
  async update(entity) {
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
  @Bind(Param('id'), Body())
  async patch(id, dto) {
    let entity = await this.repository.findOneBy({ id });
    entity = this.repository.create({ ...entity, ...dto });
    return await this.repository.save(entity);
  }

  /*
  DELETE http://localhost:3010/api/users/editor
  */
  @Delete(':id')
  @Bind(Param('id'))
  async remove(id) {
    await this.repository.delete(id);
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
  @SerializeOptions({
    groups: [REFERENCE]
  })
  @Bind(Query())
  async findByIdIn(query) {
    const content = await this.repository.findByIdIn(query);
    return {
      _embedded: {
        [this.resource]: content
      }
    };
  }
}
