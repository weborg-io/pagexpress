const multer = require('multer');
const s3 = require('../tools/s3');
const { BadRequest } = require('../../../utils/errors');

const getObject = async (req, res, next) => {
  const { objectKey } = req.params;

  if (!objectKey) {
    next(new BadRequest('Object key not provided'));
  }

  try {
    const data = await s3
      .getObject({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: `media/${objectKey}`,
      })
      .promise();

    res.json(data);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getObject,
};
