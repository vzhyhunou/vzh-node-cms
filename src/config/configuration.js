export default () => ({
  database: {
    type: process.env.DATASOURCE_TYPE,
    database: process.env.DATASOURCE_DATABASE,
    logging: process.env.DATASOURCE_LOGGING,
    autoLoadEntities: process.env.DATASOURCE_AUTO_LOAD_ENTITIES,
    synchronize: process.env.DATASOURCE_SYNCHRONIZE
  }
});
