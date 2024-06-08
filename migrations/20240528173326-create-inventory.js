'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("Inventory",{
      book_id: {
        type: Sequelize.STRING(64),
        primaryKey: true,
        references: {
            model: "Books",
            key: 'book_id'
        },

    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
    },
    quantity_available: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    location: {
        type: Sequelize.STRING(256),
        allowNull: false
    }
    })

    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Inventory');

    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
