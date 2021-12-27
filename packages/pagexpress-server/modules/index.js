const { router, config } = require('./media');

module.exports = (app, { apiRootPath }) => {
  app.use(`${apiRootPath}${config.moduleApiBasePath}`, router);
};
