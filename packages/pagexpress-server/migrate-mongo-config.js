const configModule = require('config');
const { host, port, collection, user, password } = configModule.get('mongodb');

const config = {
  mongodb: {
    url: `mongodb://${encodeURIComponent(user)}:${encodeURIComponent(
      password
    )}@${host}:${port}`,
    databaseName: collection,
    options: {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    },
  },
  migrationsDir: 'migrations',
  changelogCollectionName: 'changelog',
  migrationFileExtension: '.js',
};

module.exports = config;
