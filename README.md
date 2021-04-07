#### Introduction
This project is to provide all RESTFUL APIs & do some processes in backend

It is using:
* ExpressJS, NodeJS, with Sequelize ORM
* MySQL
* https://www.npmjs.com/package/config: organizes hierarchical configurations
* morgan: HTTP request logger middleware
* @hapi/joi: Object schema description language and validator for JavaScript objects
* cron (setup cronjob): https://github.com/kelektiv/node-cron/tree/master/examples

#### Run migration
* Install globally sequelize-cli: https://www.npmjs.com/package/sequelize-cli
* `cd database`
*  Run `sequelize db:migrate --config '../config/default.json' --env database`
*  Run `sequelize db:seed:all --config '../config/default.json' --env database`
*  Example to seed one file: Ex: `sequelize db:seed --seed ./seeders/01-permission.js --config '../config/default.json' --env database`

#### Setup Run Local
* Install nodeJs, npm and mysql locally
* Setup .env

```env
NODE_ENV=local
LOGS_DIR=./logs
TZ='Etc/UTC'
```

* Setup congif: make a copy of `./congif/default.json` -> `./config/local.json`
  * Setup database connection

#### Project Structure
* Server starts from bin/www.js
* `src` folder contains all logic code
* `database` folder contains migrations, seeders
* `config` folder contains config files, refer to https://github.com/lorenwest/node-config/wiki/Configuration-Files
* `logs` folder contains access log to server

#### Postman API
* https://www.getpostman.com/collections/6e9c3e60d58f72424cae

