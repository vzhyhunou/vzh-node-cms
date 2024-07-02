import { SelectQueryBuilder } from 'typeorm';
import repository from './item.repository';

SelectQueryBuilder.prototype.andWhereActiveTags = function (expression) {
  return this.andWhereActive(`${expression}.start`, `${expression}.end`);
};

export default repository;
