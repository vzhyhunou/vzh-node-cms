import { Item } from '../common/entity/item.entity';
import { StorageSubscriber } from './storage.subscriber';

export class ItemSubscriber extends StorageSubscriber {
  constructor(dataSource, fileService, locationService, mappingsService) {
    super(dataSource, fileService, locationService, mappingsService, Item);
  }

  afterInsert(e) {
    const item = this.restore(e);
    if (!item) {
      return;
    }
    const { entity } = e;
    this.fileService.create(this.locationService.location(item), entity.files);
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

  afterRemove(e) {
    const item = this.restore(e);
    this.fileService.clean(this.locationService.location(item), []);
  }
}
