export class BaseController {
  constructor(repository) {
    this.repository = repository;
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
  async save(entity) {
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
  async patch(entity) {
    return await this.repository.save(entity);
  }

  /*
  DELETE http://localhost:3010/api/users/editor
  */
  async remove(id) {
    await this.repository.remove({ id });
  }
}
