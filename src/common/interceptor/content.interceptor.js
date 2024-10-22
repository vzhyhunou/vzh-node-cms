import { ItemsInterceptor } from './items.interceptor';

export class ContentInterceptor extends ItemsInterceptor {
  constructor(fileService, locationService) {
    super(fileService, locationService);
  }

  process(data) {
    super.process(data.content);
    return data;
  }
}
