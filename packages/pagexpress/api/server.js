const path = require('path');
const ServerApi = require('@pagexpress/pagexpress-server');
const rootPath = path.join(__dirname, '../');
require('dotenv').config({ path: `${rootPath}.env` });

const config = require('config');

if (!config.get('jwtPrivateKey')) {
  console.log('FATAL ERROR: jwtPrivateKey is not defined');

  process.exit();
}

const serverApi = new ServerApi(config);

serverApi.run();
