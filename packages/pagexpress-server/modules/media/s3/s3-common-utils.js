class S3CommonUtils {
  constructor(config) {
    this.config = config;
  }

  getMediaKey(mediaId, { width, height, format } = {}) {
    let internalPath = '/';
    const { defaultImageFormat, aws } = this.config;
    const targetFormat = format || defaultImageFormat;

    if (width || height) {
      internalPath += `${width || 'auto'}x`;
      internalPath += `${height || 'auto'}/`;
    }

    return `${aws.s3RootFolder}${internalPath}${mediaId}_${targetFormat}`;
  }
}

module.exports = config => new S3CommonUtils(config);
