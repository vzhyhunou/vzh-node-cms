export const config = () => ({
  datasource: {
    type: process.env.DATASOURCE_TYPE,
    database: process.env.DATASOURCE_DATABASE,
    logging: process.env.DATASOURCE_LOGGING === 'true',
    autoLoadEntities: process.env.DATASOURCE_AUTO_LOAD_ENTITIES === 'true',
    synchronize: process.env.DATASOURCE_SYNCHRONIZE === 'true'
  }
});
