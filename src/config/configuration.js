export default () => ({
  database: {
    type: process.env.DATASOURCE_TYPE,
    database: process.env.DATASOURCE_DATABASE,
    logging: process.env.DATASOURCE_LOGGING === 'true',
    autoLoadEntities: process.env.DATASOURCE_AUTO_LOAD_ENTITIES === 'true',
    synchronize: process.env.DATASOURCE_SYNCHRONIZE === 'true'
  },
  cms: {
    resources: process.env.CMS_RESOURCES,
    imp: {
      init: process.env.CMS_IMP_INIT === 'true',
      path: process.env.CMS_IMP_PATH
    },
    exp: {
      path: process.env.CMS_EXP_PATH,
      full: {
        cron: process.env.CMS_EXP_FULL_CRON
      },
      inc: {
        cron: process.env.CMS_EXP_INC_CRON,
        ext: process.env.CMS_EXP_INC_EXT
      },
      pattern: process.env.CMS_EXP_PATTERN,
      limit: parseInt(process.env.CMS_EXP_LIMIT, 10)
    },
    files: {
      path: process.env.CMS_FILES_PATH
    }
  }
});
