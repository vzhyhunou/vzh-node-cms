import { SelectQueryBuilder } from 'typeorm';
import repository from './item.repository';

SelectQueryBuilder.prototype.andWhereActiveTags = function () {
  return this.andWhereActive('tag.start', 'tag.end');
};

export default repository;
