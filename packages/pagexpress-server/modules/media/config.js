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
    getImage: '/media/image/:mediaId',
    getMedia: '/media/:mediaId?',
    updateMedia: '/media/:mediaId',
    deleteMedia: '/media/:mediaId',
    uploadImages: '/media/image/upload',
    getGallery: '/galleries/:galleryId?',
    getGalleryBySlug: '/gallery-by-slug/:slug?',
    createGallery: '/galleries',
    updateGallery: '/galleries/:galleryId',
    deleteGallery: '/galleries/:galleryId',
  },
};
