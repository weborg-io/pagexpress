import path from 'path';
import Server from './server.js';

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
      mongodb: this.config.get('mongodb'),
      server: this.config.get('server'),
    });

    server.run();
  }
}

export default ServerConnector;
