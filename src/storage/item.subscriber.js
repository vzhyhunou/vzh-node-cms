import { Item } from '../common/entity/item.entity';
import { StorageSubscriber } from './storage.subscriber';

export class ItemSubscriber extends StorageSubscriber {
  constructor(dataSource, fileService, locationService, mappingsService) {
    super(dataSource, fileService, locationService, mappingsService, Item);
  }

  beforeInsert(e) {
    const { entity } = e;
    const { init } = entity;
    if (init) {
      return;
    }
    this.push(e, () =>
      this.fileService.create(
        this.locationService.location(entity),
        entity.files
      )
    );
  }

  async beforeUpdate(e) {
    const { entity, databaseEntity } = e;
    const { init } = entity;
    if (init) {
      return;
    }
    const item = await this.transform(databaseEntity);
    this.push(e, () =>
      this.fileService.update(
        this.locationService.location(item),
        this.locationService.location(entity),
        entity.files
      )
    );
  }

  async beforeRemove(e) {
    const { databaseEntity } = e;
    const item = await this.transform(databaseEntity);
    this.push(e, () =>
      this.fileService.clean(this.locationService.location(item), [])
    );
  }
}
