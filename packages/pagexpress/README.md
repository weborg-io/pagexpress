# Pagexpress

### Fast, fully customizable headless CMS
Fullstack JS stack with NodeJS on backend and NuxtJS on the front. Simple to use and customize, with intuitive REST API.
Admin panel allows to create components, pages, menu, all the rest available from the API.

## Get Started

### .env file config
Specify environment variables in .env file
```
DB_HOST=0.0.0.0
DB_PORT=27017
DB_USER=root
DB_PASS=root
APP_PORT=4000
API_URL=http://127.0.0.1:4000/v1
PAGEXPRESS_JWT_PRIVATE_KEY=mysecretword
```

### Run
Docker mongodb image
```shell
docker-compose up
```

Server API in dev mode with nodemon
```shell
yarn api:dev
```

Server API for production
```shell
yarn api:prod
```

Run pagexpress in dev mode
```shell
yarn dev
```

For production
```shell
yarn build
yarn start
```
