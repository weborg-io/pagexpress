const router = require('express').Router();
const { auth, grandAccess } = require('../../middlewares');
const { getObject } = require('./controllers/media-controller');

router.get(
  '/media/:objectKey',
  auth,
  grandAccess('readAny', 'media'),
  getObject
);

module.exports = router;
