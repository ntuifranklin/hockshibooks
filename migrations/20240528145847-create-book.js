'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    await queryInterface.createTable("Books",{
      book_id: {
        type: Sequelize.STRING(64),
        primaryKey: true
    },
    title: {
        type: Sequelize.STRING(512),
        allowNull: false
    },
    author: {
        type: Sequelize.STRING(256),
        allowNull: false
    },
    ISBN: {
        type: Sequelize.STRING(32),
        allowNull: false,
        unique:true
    },
    description: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
    },
    publication_date: {
        type: Sequelize.DATE
    },
    language: {
        type: Sequelize.STRING(64)
    },
    cover_image_url: {
        type: Sequelize.STRING(1024)
    },
    genre_id: {
        type: Sequelize.STRING(64),
        references: {
            model: "Genre",
            key: 'genre_id'
        },

    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
        
    },
    })

    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Books');

    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
