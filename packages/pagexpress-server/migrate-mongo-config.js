const configModule = require('config');
const { host, port, collection, user, password } = configModule.get('mongodb');

const config = {
  mongodb: {
    url: `mongodb://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}:${port}`,
    databaseName: collection,
    options: {
      useUnifiedTopology: true, // removes a deprecating warning when connecting
      useNewUrlParser: true,
    },
  },
  migrationsDir: 'migrations',
  changelogCollectionName: 'changelog',
  migrationFileExtension: '.js',
};

// Return the config as a promise
module.exports = config;
