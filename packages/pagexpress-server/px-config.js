const config = require('config');

module.exports = {
  apiRootPath: '/v1',
  apiBaseUrl: `${config.get('server').origin}/v1`,
  media: {
    aws: config.get('aws'),
  },
  modules: ['modules/media'],
};
