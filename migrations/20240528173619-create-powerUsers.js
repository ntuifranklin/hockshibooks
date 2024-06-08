'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("powerUsers",{
      id:{
        type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    email:{
        type:Sequelize.STRING,
        allowNull:false,
        unique:true
    },
    password:{
        type:Sequelize.STRING,
        allowNull:false
    },
    role:{
        type:Sequelize.ENUM("basic_admin","super_admin"),
        defaultValue:"basic_admin",
        allowNull:false
    }},
    {
        indexes: [
          {
            unique: true,
            fields: ['email']
          }
        ],
    })
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('powerUsers');

    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
