const path = require('path');
const ServerApi = require('@pagexpress/pagexpress-server');
const rootPath = path.join(__dirname, '../');
require('dotenv').config({ path: `${rootPath}.env` });

const config = require('config');

if (!config.get('pxSecret')) {
  console.log('FATAL ERROR: pxSecret is not defined');

  process.exit();
}

const serverApi = new ServerApi({
  mongodb: config.get('mongodb'),
  server: config.get('server'),
});

serverApi.run();
