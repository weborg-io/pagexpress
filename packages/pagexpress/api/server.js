const { Server } = require('@pagexpress/pagexpress-server');
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
