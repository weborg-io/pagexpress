const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const middlewares = require('../middlewares');
const pxConfig = require('../px-config');
const { errorHandler } = middlewares;
const rootPath = path.resolve(__dirname, '../');

/**
 * @typedef ServerConfig
 *
 * @property {object} mongodb
 * @property {object} server
 * @property {object} client
 * @property {array} whiteListDomains
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
    this.app = express();
    this.app.use(bodyParser.json({ limit: '50mb' }));
    this.app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
    this.app.use(
      cors({
        origin: [
          ...this.config.whiteListDomains.split(','),
          this.config.client.origin,
        ],
        optionsSuccessStatus: 200,
      })
    );
    this.server = require('http').createServer(this.app);
  }

  initDb() {
    require('../db/db-connect')(this.config.mongodb);
  }

  initRouting() {
    require('../routes')(this.app);
  }

  initModules() {
    const { modules, apiRootPath } = pxConfig;

    if (!(modules && Array.isArray(modules))) {
      return;
    }

    for (const modulePath of modules) {
      const moduleAbsolutePath = path.resolve(rootPath, modulePath);
      const { router } = require(moduleAbsolutePath)(middlewares, pxConfig);
      this.app.use(apiRootPath, router);
    }
  }

  initErrorHandler() {
    this.app.use(errorHandler);
  }

  initSocketIo() {
    const io = require('socket.io')(this.server, {
      cors: {
        origin: this.config.client.origin,
        methods: ['GET', 'POST'],
      },
      transports: ['websocket'],
    });
    this.app.io = io;

    io.on('connection', require('../controllers/rtm'));
  }

  init() {
    this.initExpressServer();
    this.initDb();
    this.initSocketIo();
    this.initRouting();
    this.initModules();
    this.initErrorHandler();
  }

  run() {
    const { port, host } = this.config.server;
    this.server.listen(port);
    console.log(`App listening at ${host}:${port}`);
  }
}

module.exports = Server;
