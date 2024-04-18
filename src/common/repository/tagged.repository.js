import { SelectQueryBuilder } from 'typeorm';
import './base.repository';

SelectQueryBuilder.prototype.andWhereActiveTags = function () {
  return this.andWhereActive('tag.start', 'tag.end');
};
