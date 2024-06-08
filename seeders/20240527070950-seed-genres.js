'use strict';

/** @type {import('sequelize-cli').Migration} */


module.exports = {
  up: async (queryInterface, Sequelize) => {
    
    await queryInterface.bulkInsert('Genres', [
      {
        genre_id: '1',
        name: 'Science',
       
      },{
        genre_id: '2',
        name: 'Fiction',
       
      },
      {
        genre_id: '3',
        name: 'Non-Fiction',
        
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Genres', null, {});
  },
};
