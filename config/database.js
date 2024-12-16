const { Sequelize } = require('sequelize');
require('dotenv').config();

//clear old pool
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PSWD, {
    host: process.env.DB_HOST,
    dialect: 'mariadb',
    port:3306,
    logging:console.log(),
    pool: {
      max: 500,
      min: 50,
      acquire:1000 ,
      idle: 500
   }

  });

module.exports=sequelize