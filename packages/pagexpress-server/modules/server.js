const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const errorHandler = require('../middlewares/error-handler');

/**
 * @typedef ServerConfig
 *
 * @property {string} object
 * @property {string} server
 */

class Server {
  /**
   * @param {ServerConfig} config
   */
  constructor(config) {
    this.config = config;
    this.init();
  }

  initExpressServer() {
    const app = express();
    app.use(bodyParser.json());
    app.use(cors());

    this.app = app;
  }

  initDb() {
    require('../db/db-connect')(this.config.mongodb);
  }

  initRouting() {
    require('../routes')(this.app);
  }

  initErrorHandler() {
    this.app.use(errorHandler);
  }

  init() {
    this.initExpressServer();
    this.initDb();
    this.initRouting();
    this.initErrorHandler();
  }

  run() {
    const { port, host } = this.config.server;
    this.app.listen(port);
    console.log(`App listening at ${host}:${port}`);
  }
}

module.exports = Server;
