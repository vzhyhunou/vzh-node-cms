import { Item } from '../common/entity/item.entity';
import { StorageSubscriber } from './storage.subscriber';

export class ItemSubscriber extends StorageSubscriber {
  constructor(dataSource, fileService, locationService, mappingsService) {
    super(dataSource, fileService, locationService, mappingsService, Item);
  }

  afterInsert({ entity }) {
    const { init } = entity;
    if (init) {
      return;
    }
    this.fileService.create(
      this.locationService.location(entity),
      entity.files
    );
  }

  async beforeUpdate(e) {
    const {
      entity: { init },
      databaseEntity
    } = e;
    if (init) {
      return;
    }
    this.save(e, await this.transform(databaseEntity));
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
    const { entity } = e;
    this.save(e, await this.transform(entity));
  }

  afterRemove(e) {
    const item = this.restore(e);
    this.fileService.clean(this.locationService.location(item), []);
  }
}
