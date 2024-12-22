import { SelectQueryBuilder, Repository, In } from 'typeorm';

Repository.prototype.getRelationNames = function () {
  return this.metadata.relations.map(({ propertyName }) => propertyName);
};

Repository.prototype.getPrimaryColumnName = function () {
  return this.metadata.primaryColumns[0].propertyName;
};

Repository.prototype.findById = function (id) {
  return this.findOne({
    relations: Object.fromEntries(
      this.getRelationNames().map((name) => [name, true])
    ),
    where: { [this.getPrimaryColumnName()]: id }
  });
};

Repository.prototype.findByIdIn = function (ids) {
  return this.find({
    relations: Object.fromEntries(
      this.getRelationNames().map((name) => [name, true])
    ),
    where: { [this.getPrimaryColumnName()]: In(ids) }
  });
};

Repository.prototype.findAll = function ({ page, size, sort }) {
  return Promise.all([
    this.find({
      relations: Object.fromEntries(
        this.getRelationNames().map((name) => [name, true])
      ),
      skip: page * size,
      take: size,
      order: sort && (([field, order]) => ({ [field]: order }))(sort)
    }),
    this.count()
  ]).then(([content, totalElements]) => ({
    content,
    totalElements
  }));
};

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

SelectQueryBuilder.prototype.andWhereIn = function (expression, fields) {
  fields &&
    this.andWhere(`${expression} in (:...${expression})`, {
      [expression]: fields
    });
  return this;
};

SelectQueryBuilder.prototype.andWhereInQuery = function (expression, builder) {
  return this.andWhere(
    `${expression} in (${builder.getQuery()})`,
    builder.getParameters()
  );
};

SelectQueryBuilder.prototype.orderByName = function (resource, sort) {
  sort &&
    (([field, order]) => this.orderBy(`${resource}.${field}`, order))(sort);
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
