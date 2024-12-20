export class BaseController {
  constructor(repository, eventEmitter, type) {
    this.repository = repository;
    this.eventEmitter = eventEmitter;
    this.type = type;
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
    const entityId = entity[this.repository.getPrimaryColumnName()];
    this.eventEmitter.emit(`before.created.${this.type.name.toLowerCase()}`, {
      entityId,
      entity
    });
    await this.repository.save(entity);
    const updatedEntity = await this.repository.findById(entityId);
    this.eventEmitter.emit(`after.created.${this.type.name.toLowerCase()}`, {
      entityId,
      entity,
      updatedEntity
    });
    return updatedEntity;
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

  async update(entity) {
    const entityId = entity[this.repository.getPrimaryColumnName()];
    const databaseEntity = await this.repository.findById(entityId);
    this.eventEmitter.emit(`before.updated.${this.type.name.toLowerCase()}`, {
      entityId,
      entity,
      databaseEntity
    });
    await this.repository.save(entity);
    const updatedEntity = await this.repository.findById(entityId);
    this.eventEmitter.emit(`after.updated.${this.type.name.toLowerCase()}`, {
      entityId,
      entity,
      databaseEntity,
      updatedEntity
    });
    return updatedEntity;
  }

  /*
  DELETE http://localhost:3010/api/users/editor
  */
  async remove(entityId) {
    const databaseEntity = await this.repository.findById(entityId);
    this.eventEmitter.emit(`before.removed.${this.type.name.toLowerCase()}`, {
      entityId,
      databaseEntity
    });
    await this.repository.remove({
      [this.repository.getPrimaryColumnName()]: entityId
    });
    this.eventEmitter.emit(`after.removed.${this.type.name.toLowerCase()}`, {
      entityId,
      databaseEntity
    });
  }
}
