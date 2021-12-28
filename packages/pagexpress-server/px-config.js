module.exports = {
  apiRootPath: process.env.API_BASE_PATH,
  apiBaseUrl: `${process.env.SERVER_APP_URL}${process.env.API_BASE_PATH}`,
  media: {
    s3Bucket: process.env.AWS_S3_BUCKET,
  },
};
