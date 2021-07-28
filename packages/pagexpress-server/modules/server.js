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
    app.use(errorHandler);

    this.app = app;
  }

  initDb() {
    require('../db/db-connect')(this.config.mongodb);
  }

  initRouting() {
    require('../routes')(this.app);
  }

  init() {
    this.initExpressServer();
    this.initDb();
    this.initRouting();
  }

  run() {
    const { port, host } = this.config.server;
    this.app.listen(port, host);
    console.log(`App listening at ${host}:${port}`);
  }
}

module.exports = Server;
