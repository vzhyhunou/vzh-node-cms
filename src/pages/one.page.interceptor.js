import { BaseInterceptor } from '../common/interceptor/base.interceptor';

export class OnePageInterceptor extends BaseInterceptor {
  process({ id, title, content, files }) {
    const t = title[0].title;
    const c = content[0].content;
    return {
      id,
      title: t,
      content: c,
      files: files.filter(({ name }) => c.includes(name))
    };
  }
}
