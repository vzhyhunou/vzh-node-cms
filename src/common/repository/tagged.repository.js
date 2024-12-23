import { SelectQueryBuilder } from 'typeorm';

import './items.repository';

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
  createActiveTagNamesBuilder(selection, names) {
    const builder = this.createQueryBuilder(selection).select(
      `${selection}.id`
    );
    if (!names.length) {
      return builder;
    }
    const expression = names.join('.');
    return builder
      .innerJoin(`${selection}.tags`, expression)
      .andWhereActiveTagNames(expression, names);
  }
};
