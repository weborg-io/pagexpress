const router = require('express').Router();
const defaultModuleConfig = require('./config');
const MediaController = require('./controllers/media-controller');
const { uploadTemp } = require('./controllers/upload');

module.exports = (accessMiddlewares, customModuleConfig = {}) => {
  const mediaModuleConfig = {
    ...defaultModuleConfig,
    ...customModuleConfig,
  };
  const { auth, grandAccess } = accessMiddlewares;
  const { getImage, getMedia, uploadImages } = mediaModuleConfig.routes;
  const mediaController = new MediaController(mediaModuleConfig);

  router.get(
    getImage,
    auth,
    grandAccess('readAny', mediaModuleConfig.resourceName),
    mediaController.getImage
  );
  router.get(
    getMedia,
    auth,
    grandAccess('readAny', mediaModuleConfig.resourceName),
    mediaController.getMedia
  );
  router.post(
    uploadImages,
    auth,
    grandAccess('createOwn', mediaModuleConfig.resourceName),
    uploadTemp.array('images'),
    mediaController.uploadImages
  );

  return {
    router,
    mediaModuleConfig,
  };
};
