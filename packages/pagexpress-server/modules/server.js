import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import errorHandler from '../middlewares/error-handler.js';

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
    this.app.use(bodyParser.json({ limit: '50mb' }));
    this.app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
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
    this.initErrorHandler();
  }

  run() {
    const { port, host } = this.config.server;
    this.server.listen(port);
    console.log(`App listening at ${host}:${port}`);
  }
}

export default Server;
