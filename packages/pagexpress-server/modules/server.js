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
    this.app = express();
    this.app.use(bodyParser.json());
    this.app.use(cors());
    this.server = require('http').createServer(this.app);
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

  initSocketIo() {
    const io = require('socket.io')(this.server, {
      cors: {
        origin: process.env.CLIENT_APP_URL,
        methods: ['GET', 'POST'],
      },
    });
    this.app.io = io;

    io.on('connection', require('../controllers/rtm'));
  }

  init() {
    this.initExpressServer();
    this.initDb();
    this.initSocketIo();
    this.initRouting();
    this.initErrorHandler();
  }

  run() {
    const { port, host } = this.config.server;
    this.server.listen(port);
    console.log(`App listening at ${host}:${port}`);
  }
}

module.exports = Server;
