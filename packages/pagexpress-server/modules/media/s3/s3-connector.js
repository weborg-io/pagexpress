const fs = require('fs');
const s3 = require('./aws-s3');

class S3Connector {
  constructor(config) {
    this.config = config;
  }

  getS3Params(file, targetKey) {
    const fileStream = fs.createReadStream(file.path);

    return {
      ContentType: file.mimetype,
      Bucket: this.config.s3Bucket,
      Key: targetKey || Date.now().toString(),
      Body: fileStream,
    };
  }

  async upload(mediaId, file, targetKey) {
    const uploadParams = this.getS3Params(file, targetKey);

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
