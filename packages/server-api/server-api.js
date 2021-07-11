const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const errorHandler = require('./middlewares/error-handler');

class ServerApi {
  /**
   * @param {object} config - config module instance with server settings
   */
  constructor(config) {
    this.config = config;
    this.init();
  }

  initExpressServer() {
    const app = express();
    app.use(bodyParser.json());
    app.use(cors());
    app.use(errorHandler);

    this.app = app;
  }

  initDb() {
    require('./db/db-connect')(this.config.get('mongodb'));
  }

  initRouting() {
    require('./routes')(this.app);
  }

  init() {
    this.initExpressServer();
    this.initDb();
    this.initRouting();
  }

  run() {
    const serverConfig = this.config.get('server');
    this.app.listen(serverConfig.port, serverConfig.host);
    console.log(`App listening at ${serverConfig.host}:${serverConfig.port}`);
  }
}

module.exports = ServerApi;
