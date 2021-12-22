const media = require('./media');

module.exports = app => {
  app.use('/v1', media);
};
