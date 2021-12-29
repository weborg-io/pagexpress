const path = require('path');

module.exports = {
  mediaApiBasePath: '/media',
  s3RootFolder: 'media',
  resourceName: 'media',
  defaultImageFormat: 'webp',
  tempUploadFolder: path.resolve(__dirname, 'tmp'),
  maxWidth: 2000,
  maxHeight: 1200,
  routes: {
    getImage: '/image/:mediaId',
    getMedia: '/:mediaId?',
    uploadImages: '/image/upload',
  },
};
