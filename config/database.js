const { Sequelize } = require('sequelize');
require('dotenv').config();

//clear old pool
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PSWD, {
    host: process.env.DB_HOST,
    dialect: 'mariadb',
    port:3306,
    logging:console.log(),
    pool: {
      max: 1024,
      min: 64,
      acquire:1024 ,
      idle: 512
   }

  });

module.exports=sequelize