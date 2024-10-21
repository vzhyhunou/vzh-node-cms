import { I18nContext } from 'nestjs-i18n';

import repository from '../common/repository/tagged.repository';
import { PAGE_TAG } from './constants';

export default {
  ...repository,

  list({ id, tags, title, content }, { page, size, sort }) {
    const filter = this.createQueryBuilder('page')
      .leftJoin('page.tags', 'tag')
      .leftJoin('page.title', 'title')
      .leftJoin('page.content', 'content')
      .select('page.id')
      .andWhereContains('page.id', id)
      .andWhereIn('tag.name', tags)
      .andWhereContains('title.value', title)
      .andWhereContains('content.value', content);

    const b = this.createQueryBuilder('page')
      .leftJoin('page.tags', 'tag')
      .leftJoin('page.title', 'title', 'title.key = :lang', {
        lang: I18nContext.current().lang
      })
      .select(['page.id', 'tag.id', 'tag.name', 'title.key', 'title.value'])
      .andWhereInQuery('page.id', filter)
      .orderByName('page', sort)
      .skip(page * size)
      .take(size)
      .getMany();

    const c = this.createQueryBuilder('page')
      .select(['page.id'])
      .andWhereInQuery('page.id', filter)
      .getCount();

    return Promise.all([b, c]).then(([content, totalElements]) => ({
      content,
      totalElements
    }));
  },

  one(id, editor) {
    const filter = this.createActiveTagNamesBuilder(
      'page',
      editor ? [] : [PAGE_TAG.PUBLISHED]
    );

    return this.createQueryBuilder('page')
      .leftJoin('page.title', 'title', 'title.key = :lang', {
        lang: I18nContext.current().lang
      })
      .innerJoin('page.content', 'content', 'content.key = :lang', {
        lang: I18nContext.current().lang
      })
      .select(['page.id', 'title.value', 'content.value'])
      .andWhere('page.id = :id', { id })
      .andWhereInQuery('page.id', filter)
      .getOne();
  },

  menu() {
    const filter = this.createActiveTagNamesBuilder('page', [PAGE_TAG.MENU]);

    return this.createQueryBuilder('page')
      .innerJoin('page.title', 'title', 'title.key = :lang', {
        lang: I18nContext.current().lang
      })
      .select(['page.id', 'title.value'])
      .andWhereInQuery('page.id', filter)
      .orderBy('title.value')
      .getMany();
  }
};
