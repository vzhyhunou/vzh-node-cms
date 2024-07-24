import { BaseInterceptor } from '../common/interceptor/base.interceptor';

export class MenuPageInterceptor extends BaseInterceptor {
  process(items) {
    return items.map(({ id, title }) => ({
      id,
      title: title[0].title
    }));
  }
}
