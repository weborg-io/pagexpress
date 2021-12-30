const AWS = require('aws-sdk');

module.exports = ({ accessKeyId, secretAccessKey, region }) => {
  AWS.config.update({
    accessKeyId,
    secretAccessKey,
    region,
  });

  return new AWS.S3();
};
