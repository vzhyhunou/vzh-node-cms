import { ItemInterceptor } from './item.interceptor';

export class ItemsInterceptor extends ItemInterceptor {
  constructor(fileService, locationService) {
    super(fileService, locationService);
  }

  process(data) {
    for (const items of Object.values(data._embedded)) {
      for (const item of items) {
        super.process(item);
      }
    }
    return data;
  }
}
