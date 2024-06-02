import { Injectable } from '@nestjs/common';

@Injectable()
export class EventService {
  map = [];

  add(handler) {
    this.map.push(handler);
  }

  beforeCreate(item) {
    for (const handler of this.map) {
      handler.beforeCreate && handler.beforeCreate(item);
    }
  }

  afterCreate(item) {
    for (const handler of this.map) {
      handler.afterCreate && handler.afterCreate(item);
    }
  }

  beforeSave(oldItem, newItem) {
    for (const handler of this.map) {
      handler.beforeSave && handler.beforeSave(oldItem, newItem);
    }
  }

  afterSave(oldItem, newItem) {
    for (const handler of this.map) {
      handler.afterSave && handler.afterSave(oldItem, newItem);
    }
  }

  beforeDelete(item) {
    for (const handler of this.map) {
      handler.beforeDelete && handler.beforeDelete(item);
    }
  }

  afterDelete(item) {
    for (const handler of this.map) {
      handler.afterDelete && handler.afterDelete(item);
    }
  }
}
