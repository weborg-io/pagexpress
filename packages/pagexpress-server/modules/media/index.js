const router = require('express').Router();
const defaultModuleConfig = require('./config');
const MediaController = require('./controllers/media-controller');
const GalleryController = require('./controllers/gallery-controller');
const { localUpload } = require('./local/local-upload');

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
  const galleryController = new GalleryController(pxConfig);

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
  router.patch(
    routes.updateMedia,
    auth,
    grandAccess('updateAny', resourceName),
    mediaController.updateMedia
  );
  router.delete(
    routes.deleteMedia,
    auth,
    grandAccess('deleteAny', resourceName),
    mediaController.deleteMedia
  );

  router.get(
    routes.getGallery,
    auth,
    grandAccess('readAny', resourceName),
    galleryController.getGallery
  );
  router.post(
    routes.createGallery,
    auth,
    grandAccess('createOwn', resourceName),
    galleryController.createGallery
  );
  router.put(
    routes.updateGallery,
    auth,
    grandAccess('updateAny', resourceName),
    galleryController.updateGallery
  );
  router.delete(
    routes.deleteGallery,
    auth,
    grandAccess('deleteOwn', resourceName),
    galleryController.deleteGallery
  );

  return {
    router,
    mediaModuleConfig,
  };
};
