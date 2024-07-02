import { SelectQueryBuilder } from 'typeorm';

SelectQueryBuilder.prototype.andWhereLike = function (
  expression,
  field,
  preffix,
  suffix
) {
  field &&
    this.andWhere(`lower(${expression}) like :${expression}`, {
      [expression]: `${preffix}${field.toLowerCase()}${suffix}`
    });
  return this;
};

SelectQueryBuilder.prototype.andWhereContains = function (expression, field) {
  return this.andWhereLike(expression, field, '%', '%');
};

SelectQueryBuilder.prototype.andWhereIn = function (expression, field) {
  field &&
    this.andWhere(`${expression} in (:...fields)`, {
      fields: typeof field === 'string' ? [field] : field
    });
  return this;
};

SelectQueryBuilder.prototype.andWhereInQuery = function (expression, builder) {
  return this.andWhere(
    `${expression} in (${builder.getQuery()})`
  ).setParameters(builder.getParameters());
};

SelectQueryBuilder.prototype.orderByObject = function (resource, value) {
  value &&
    (([field, order]) => this.orderBy(`${resource}.${field}`, order))(
      value.split(',')
    );
  return this;
};

SelectQueryBuilder.prototype.andWhereEqual = function (expression, field) {
  field &&
    this.andWhere(`${expression} = :${expression}`, { [expression]: field });
  return this;
};

SelectQueryBuilder.prototype.andWhereActive = function (start, end) {
  return this.andWhere(
    `(${start} is null or ${start} < :current) and (${end} is null or :current < ${end})`,
    { current: new Date() }
  );
};
