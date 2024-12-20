export class BaseController {
  constructor(repository, eventEmitter) {
    this.repository = repository;
    this.eventEmitter = eventEmitter;
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
    await this.repository.save(entity);
    const updatedEntity = await this.repository.findById(entityId);
    this.eventEmitter.emit('created', { entityId, entity, updatedEntity });
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
  async save(entity) {
    const entityId = entity[this.repository.getPrimaryColumnName()];
    const databaseEntity = await this.repository.findById(entityId);
    await this.repository.save(entity);
    const updatedEntity = await this.repository.findById(entityId);
    this.eventEmitter.emit('updated', {
      entityId,
      entity,
      databaseEntity,
      updatedEntity
    });
    return updatedEntity;
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
    const entityId = entity[this.repository.getPrimaryColumnName()];
    const databaseEntity = await this.repository.findById(entityId);
    await this.repository.save(entity);
    const updatedEntity = await this.repository.findById(entityId);
    this.eventEmitter.emit('updated', {
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
    await this.repository.remove({
      [this.repository.getPrimaryColumnName()]: entityId
    });
    this.eventEmitter.emit('removed', { entityId, databaseEntity });
  }
}
