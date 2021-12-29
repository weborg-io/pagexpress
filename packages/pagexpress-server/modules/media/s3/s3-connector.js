const s3 = require('./aws-s3');
const { image } = require('../tools');
const s3CommonUtils = require('./s3-common-utils');

class S3Connector {
  constructor(config) {
    this.config = config;
    this.utils = s3CommonUtils(config);
  }

  getS3Params(bufferImageObject, targetKey) {
    return {
      ContentType: `image/${bufferImageObject.format}`,
      Bucket: this.config.s3Bucket,
      Key: targetKey || Date.now().toString(),
      Body: bufferImageObject.data,
    };
  }

  /**
   *
   * @param params
   * @returns {Promise<null|Request<S3.GetObjectOutput, AWSError>>}
   */
  async getObjectIfExists(params) {
    try {
      await s3.headObject(params).promise();

      return s3.getObject(params);
    } catch (headErr) {
      if (headErr.code === 'NotFound') {
        return null;
      }
    }
  }

  /**
   * @param {string} mediaId
   * @param {object} options
   * @returns {Promise<null|stream.Readable|Sharp>}
   */
  async getImageVersion(mediaId, options) {
    const targetKey = this.utils.getMediaKey(mediaId, options);
    const requestedImage = await this.getObjectIfExists({
      Bucket: this.config.s3Bucket,
      Key: targetKey,
    });

    if (requestedImage) {
      return requestedImage.createReadStream();
    }

    const originImageKey = this.utils.getMediaKey(mediaId);
    const originImage = await this.getObjectIfExists({
      Bucket: this.config.s3Bucket,
      Key: originImageKey,
    });

    if (!originImage) {
      return null;
    }

    const transformer = image.getImageTransformer(options);
    const imageStream = originImage.createReadStream().pipe(transformer);
    await this.upload({ data: imageStream }, targetKey);

    return imageStream;
  }

  async upload(bufferImageObject, targetKey) {
    const uploadParams = this.getS3Params(bufferImageObject, targetKey);

    try {
      await s3
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
}

module.exports = S3Connector;
