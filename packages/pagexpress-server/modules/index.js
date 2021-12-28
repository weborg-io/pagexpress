const MediaModule = require('./media');

module.exports = (app, middlewares, pxConfig = {}) => {
  const { router, mediaModuleConfig } = MediaModule(middlewares, pxConfig);
  const mediaModuleBasePath =
    pxConfig.apiRootPath + mediaModuleConfig.mediaApiBasePath;
  app.use(mediaModuleBasePath, router);
};
