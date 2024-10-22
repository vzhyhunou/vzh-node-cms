import { ItemInterceptor } from './item.interceptor';

export class ItemsInterceptor extends ItemInterceptor {
  constructor(fileService, locationService) {
    super(fileService, locationService);
  }

  process(data) {
    for (const item of data) {
      super.process(item);
    }
    return data;
  }
}
