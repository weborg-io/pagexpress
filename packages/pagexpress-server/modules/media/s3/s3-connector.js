const { image } = require('../tools');
const s3CommonUtils = require('./s3-common-utils');

class S3Connector {
  constructor(config) {
    this.config = config;
    this.utils = s3CommonUtils(config);
    this.s3 = require('./aws-s3')(config.aws);
  }

  getS3Params(bufferImageObject, targetKey) {
    return {
      ContentType: `image/${bufferImageObject.info.format}`,
      Bucket: this.config.aws.s3Bucket,
      Key: targetKey || Date.now().toString(),
      Body: bufferImageObject.data,
    };
  }

  /**
   *
   * @param params
   * @returns {Promise<null|Request<S3.GetObjectOutput>>}
   */
  async getObjectIfExists(params) {
    try {
      await this.s3.headObject(params).promise();

      return this.s3.getObject(params);
    } catch (headErr) {
      if (headErr.code === 'NotFound') {
        return null;
      }
    }
  }

  /**
   * @param {string} mediaId
   * @param {object} options
   * @returns {Promise<Request<S3.GetObjectOutput>>}
   */
  async createImageVersion(mediaId, options) {
    const originImageKey = this.utils.getMediaKey(mediaId);
    const originImage = await this.getObjectIfExists({
      Bucket: this.config.s3Bucket,
      Key: originImageKey,
    });

    if (!originImage) {
      return null;
    }

    const transformer = image.getImageTransformer(null, options);
    const imageStream = originImage.createReadStream().pipe(transformer);
    const targetKey = this.utils.getMediaKey(mediaId, options);
    const format = options.format || this.config.defaultImageFormat;
    await this.upload({ data: imageStream, info: { format } }, targetKey);
    return this.s3.getObject({
      Bucket: this.config.s3Bucket,
      Key: targetKey,
    });
  }

  async upload(bufferImageObject, targetKey) {
    const uploadParams = this.getS3Params(bufferImageObject, targetKey);
    try {
      await this.s3
        .upload(uploadParams, err => {
          if (err) {
            throw new Error(err);
          }
        })
        .promise();
    } catch (err) {
      throw new Error(err);
    }
  }

  async removeObject(objectKey) {
    try {
      console.log(objectKey);
      const params = {
        Bucket: this.config.s3Bucket,
        Key: objectKey,
      };
      await this.s3.headObject(params).promise();
      await this.s3.deleteObject(params).promise();

      return objectKey;
    } catch (err) {
      throw new Error(err);
    }
  }
}

module.exports = S3Connector;
