'use strict';

const bcrypt = require('bcrypt');

const sequelize = require('../config/database');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  
  up: async (queryInterface,sequelize)=>{
    const salt =  await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("plaintextpassword", salt);

  await queryInterface.bulkInsert('powerUsers', [
    {
			email: 'creativeitems2003@gmail.com',
			password: hashedPassword,
			role:'basic_admin',
		 
    },{
      email: 'juniorhoza56@gmail.com',
			password: hashedPassword,
			role:'super_admin',
		 
    }
 
  ]);
},

down: async (queryInterface, Sequelize) => {
  await queryInterface.bulkDelete('powerUsers', null, {});
},
};
