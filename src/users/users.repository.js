import repository from '../common/repository/tagged.repository';

export default {
  ...repository,

  list({ id, tags }, { page, size, sort }) {
    const filter = this.createQueryBuilder('user')
      .leftJoin('user.tags', 'tag')
      .select('user.id')
      .andWhereContains('user.id', id)
      .andWhereIn('tag.name', tags);

    const b = this.createQueryBuilder('user')
      .leftJoin('user.tags', 'tag')
      .select(['user.id', 'tag.id', 'tag.name'])
      .andWhereInQuery('user.id', filter)
      .orderByName('user', sort)
      .skip(page * size)
      .take(size)
      .getMany();

    const c = this.createQueryBuilder('user')
      .select(['user.id'])
      .andWhereInQuery('user.id', filter)
      .getCount();

    return Promise.all([b, c]).then(([content, totalElements]) => ({
      content,
      totalElements
    }));
  },

  withActiveRoles(id) {
    return this.createQueryBuilder('user')
      .leftJoin('user.tags', 'tag')
      .select(['user.id', 'user.password', 'tag.name'])
      .andWhereEqual('user.id', id)
      .andWhereActiveTags('tag')
      .getOne();
  }
};
