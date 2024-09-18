'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Inventory', [
      {
        book_id: '1',
        quantity_available: 100,
        location: 'Warehouse 1',
      
      },
      {
        book_id: '2',
        quantity_available: 50,
        location: 'Warehouse 2',
       
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Inventory', null, {});
  }
};
