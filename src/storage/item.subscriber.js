import { Item } from '../common/entity/item.entity';
import { StorageSubscriber } from './storage.subscriber';

export class ItemSubscriber extends StorageSubscriber {
  constructor(dataSource, fileService, locationService, mappingsService) {
    super(dataSource, fileService, locationService, mappingsService, Item);
  }

  async beforeInsert(e) {
    const { entity } = e;
    const { init } = entity;
    if (init) {
      return;
    }
    await this.save(e, entity);
  }

  afterInsert(e) {
    const item = this.restore(e);
    if (!item) {
      return;
    }
    const { entity } = e;
    this.fileService.create(this.locationService.location(item), entity.files);
  }

  async beforeUpdate(e) {
    const {
      entity: { init },
      databaseEntity
    } = e;
    if (init) {
      return;
    }
    await this.save(e, databaseEntity);
  }

  afterUpdate(e) {
    const item = this.restore(e);
    if (!item) {
      return;
    }
    const { entity } = e;
    this.fileService.update(
      this.locationService.location(item),
      this.locationService.location(entity),
      entity.files
    );
  }

  async beforeRemove(e) {
    const { databaseEntity } = e;
    await this.save(e, databaseEntity);
  }

  afterRemove(e) {
    const item = this.restore(e);
    this.fileService.clean(this.locationService.location(item), []);
  }
}
