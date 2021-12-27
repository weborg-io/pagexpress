const { AWS_SECRET_ACCESS_KEY, AWS_ACCESS_KEY_ID, AWS_REGION, AWS_S3_BUCKET } =
  process.env;
const knoxClient = require('knox').createClient({
  key: AWS_ACCESS_KEY_ID,
  secret: AWS_SECRET_ACCESS_KEY,
  region: AWS_REGION,
  bucket: AWS_S3_BUCKET,
});

module.exports = knoxClient;
