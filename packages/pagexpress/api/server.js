const path = require('path');
const { Server } = require('@pagexpress/pagexpress-server');
const rootPath = path.join(__dirname, '../');
require('dotenv').config({ path: `${rootPath}.env` });

const config = require('config');

if (!config.get('pxSecret')) {
  console.log('FATAL ERROR: pxSecret is not defined');

  process.exit();
}

const server = new Server({
  mongodb: config.get('mongodb'),
  server: config.get('server'),
});

server.run();
