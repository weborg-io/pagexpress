class S3CommonUtils {
  constructor(config) {
    this.config = config;
  }

  getMediaKey(mediaId, { width, height, format } = {}) {
    let internalPath = '/';
    const { defaultImageFormat, s3RootFolder } = this.config;
    const targetFormat = format || defaultImageFormat;

    if (width || height) {
      internalPath += `${width || 'auto'}x`;
      internalPath += `${height || 'auto'}/`;
    }

    return `${s3RootFolder}${internalPath}${mediaId}_${targetFormat}`;
  }
}

module.exports = config => new S3CommonUtils(config);
