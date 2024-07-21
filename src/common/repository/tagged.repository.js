import { SelectQueryBuilder } from 'typeorm';

import repository from './items.repository';

SelectQueryBuilder.prototype.andWhereActiveTags = function (expression) {
  return this.andWhereActive(`${expression}.start`, `${expression}.end`);
};

SelectQueryBuilder.prototype.andWhereActiveTagNames = function (
  expression,
  names
) {
  return this.andWhereIn(`${expression}.name`, names).andWhereActiveTags(
    expression
  );
};

export default {
  ...repository,

  createActiveTagNamesBuilder(selection, names) {
    const builder = this.createQueryBuilder(selection).select(
      `${selection}.id`
    );
    if (!names.length) {
      return builder;
    }
    return builder
      .innerJoin(`${selection}.tags`, 'tag')
      .andWhereActiveTagNames('tag', names);
  }
};
