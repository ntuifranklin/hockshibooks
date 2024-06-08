'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Books', [
      
      {
        book_id: '1',
        title: 'Book Title 2',
        author: 'Author 2',
        ISBN: '0987654321',
        description: 'Description for book 2',
        price: 29.99,
        genre: '2',
        publication_date: new Date(),
        language: 'English',
        cover_image_url: 'http://example.com/book2.jpg',
       
      },{
        book_id: '2',
        title: 'Book Title 1',
        author: 'Author 1',
        ISBN: '1234567890',
        description: 'Description for book 1',
        price: 19.99,
        genre: '1',
        publication_date: new Date(),
        language: 'English',
        cover_image_url: 'http://example.com/book1.jpg',
        
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Books', null, {});
  },
};
