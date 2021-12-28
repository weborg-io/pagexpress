const path = require('path');

module.exports = {
  mediaApiBasePath: '/media',
  s3RootFolder: 'media',
  resourceName: 'media',
  defaultImageFormat: 'webp',
  tempUploadFolder: path.resolve(__dirname, 'tmp'),
  routes: {
    getImage: '/image/:mediaId',
    getMedia: '/:mediaId?',
    uploadImages: '/image/upload',
  },
};
