const router = require('express').Router();
const defaultModuleConfig = require('./config');
const MediaController = require('./controllers/media-controller');
const { localUpload } = require('./controllers/local-upload');

module.exports = (accessMiddlewares, pxConfig = {}) => {
  const mediaModuleConfig = {
    ...defaultModuleConfig,
    ...pxConfig.media,
  };
  const { auth, grandAccess } = accessMiddlewares;
  const { resourceName, tempUploadFolder, routes } = mediaModuleConfig;
  const mediaController = new MediaController(mediaModuleConfig, {
    ...pxConfig,
    media: undefined,
  });

  router.get(routes.getImage, mediaController.getImage);
  router.get(
    routes.getMedia,
    auth,
    grandAccess('readAny', resourceName),
    mediaController.getMedia
  );
  router.post(
    routes.uploadImages,
    auth,
    grandAccess('createOwn', resourceName),
    localUpload(tempUploadFolder).array('images'),
    mediaController.uploadImages
  );

  return {
    router,
    mediaModuleConfig,
  };
};
