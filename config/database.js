const { Sequelize } = require('sequelize');
require('dotenv').config();


//check db settings
console.log("Current environment: ", process.env.NODE_ENV);
console.log("Current settings: ");
console.log("DB_USER: ", process.env.DB_USER);
console.log("DB_PSWD: ", process.env.DB_PSWD);
console.log("DB_NAME: ", process.env.DB_NAME);
console.log("DB_HOST: ", process.env.DB_HOST);

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PSWD, {
    host: '172.17.0.2',
    dialect: 'mariadb',
    port:3306,
    logging:console.log(),
    pool: {
      max: 6,
      min: 0,
      acquire: 30000,
      idle: 10000
   },
  });

  module.exports=sequelize