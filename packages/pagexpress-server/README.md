# Pagexpress server API

### NodeJS server headless CMS API
Core backend module with REST API built on ExpressJS server.

## Get Started
Install package module
```shell
yarn add @pagexpress/pagexpress-server
```

Setup config using [config module](https://www.npmjs.com/package/config)
Create `config` directory in the root directory of your app. Add there `default.json` file with value
```
{
  "pxSecret": "yourSecretKey"
}
```

To make it safe use `custom-environment-variables.json` file to override defulat one
```
{
  "pxSecret": "YOUR_ENV_VARIABLE"
}
```

Run pagexpress server
```
const ServerApi = require('@pagexpress/pagexpress-server');

const serverApi = new ServerApi({
  mongodb: mongodbParams,
  server: serverParams,
});

serverApi.run();
```

Required MongoDB params:
- host
- port
- collection
- user
- password

Server params:
- host
- port
