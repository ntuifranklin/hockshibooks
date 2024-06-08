const { Sequelize } = require('sequelize');
require('dotenv').config();


const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PSWD, {
    host: '172.17.0.2',
    dialect: 'mariadb',
    port:3306,
    logging:console.log()
  });

  module.exports=sequelize