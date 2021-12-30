const path = require('path');
const Server = require('./server');

class ServerConnector {
  constructor() {
    this.config = this.getConfig();
  }

  getDefaultEnvFilePath() {
    return path.join(__dirname, '../', '.env');
  }

  getConfig() {
    const config = require('config');

    if (!config.get('pxSecret')) {
      console.log('FATAL ERROR: pxSecret is not defined');

      process.exit();
    }

    return config;
  }

  init() {
    const server = new Server({
      client: this.config.get('client'),
      mongodb: this.config.get('mongodb'),
      server: this.config.get('server'),
      whiteListDomains: this.config.get('whiteListDomains'),
    });

    server.run();
  }
}

module.exports = ServerConnector;
