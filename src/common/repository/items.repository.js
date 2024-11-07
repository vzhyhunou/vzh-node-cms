import { Repository, MoreThan } from 'typeorm';

import './base.repository';

Repository.prototype.findByIndex = function (index, date) {
  return this.findOne({
    relations: Object.fromEntries(
      this.getRelationNames().map((name) => [name, true])
    ),
    skip: index,
    take: 1,
    where: {
      ...(date ? { date: MoreThan(date) } : {})
    }
  });
};
