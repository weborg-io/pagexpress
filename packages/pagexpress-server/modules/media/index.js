const router = require('express').Router();
const config = require('./config.json');
const { auth, grandAccess } = require('../../middlewares');
const {
  sendImage,
  getMedia,
  uploadImages,
} = require('./controllers/media-controller');
const { uploadTemp } = require('./controllers/upload');

router.get('/image/:mediaId', auth, grandAccess('readAny', 'media'), sendImage);
router.get('/:mediaId?', auth, grandAccess('readAny', 'media'), getMedia);
router.post(
  '/image/upload',
  auth,
  grandAccess('createOwn', 'media'),
  uploadTemp.array('images'),
  uploadImages
);

module.exports = {
  router,
  config,
};
