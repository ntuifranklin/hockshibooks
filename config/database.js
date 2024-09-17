const { Sequelize } = require('sequelize');
require('dotenv').config();


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