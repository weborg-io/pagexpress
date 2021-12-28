module.exports = {
  mediaApiBasePath: '/media',
  s3RootFolder: 'media',
  resourceName: 'media',
  routes: {
    getImage: '/image/:mediaId',
    getMedia: '/:mediaId?',
    uploadImages: '/image/upload',
  },
};
