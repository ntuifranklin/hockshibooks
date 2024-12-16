const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize=require("../config/database")
const {Md5Rand}=require("../utilities/functions")
const crypto = require('crypto');


const Genre = require('./genreModel'); 
const OrderItems= require("./orderItemsModel");
const { books } = require('googleapis/build/src/apis/books');

class Books extends Model {}

Books.init({
    book_id: {
        type: DataTypes.STRING(64),
        primaryKey: true
    },
    seo_friendly_title: {
        type: DataTypes.STRING(1024),
        allowNull: false
    },
    title: {
        type: DataTypes.STRING(512),
        allowNull: false
    },
    author: {
        type: DataTypes.STRING(256),
        allowNull: false
    },
    ISBN: {
        type: DataTypes.STRING(32),
        allowNull: false,
        unique:true
    },
    description: {
        type: DataTypes.STRING(1536),
        allowNull: false
    },
    number_of_pages: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    publication_date: {
        type: DataTypes.DATE
    },
    language: {
        type: DataTypes.STRING(32),
        allowNull: false,
        defaultValue: 'English'
    },
    cover_image_url: {
        type: DataTypes.STRING(1024)
    },
    cover_image_url_small: {
        type: DataTypes.STRING(1024)
    },
    cover_image_url_medium: {
        type: DataTypes.STRING(1024)
    },
    cover_image_url_large: {
        type: DataTypes.STRING(1024)
    }
    
}, {
    sequelize,
    modelName: 'Books',
    tableName: 'Books',
    hooks: {
        beforeCreate: async (book) => {
               /**
         * Hook to generate a book_id before creating a new book.
         *
         */
          if (!book.book_id) {
               book.book_id =  await crypto.createHash('md5').update(Math.random().toString()).digest('hex');
          }
        },beforeUpdate: async (book) => {
             /**
         * Hook to generate a book_id before updating an existing book.
         * 
         */
            if (!book.book_id) {
              
               book.book_id = await crypto.createHash('md5').update(Math.random().toString()).digest('hex');
            }
            }
            },
            timestamps: false,
    },
  
);

// Establish the association~
// Books.belongsTo(Genre, { foreignKey: 'genre' });
// Genre.hasMany(Books, { foreignKey: 'genre' });

Books.hasMany(OrderItems, { foreignKey: 'book_id' });
OrderItems.belongsTo(Books, { foreignKey: 'book_id' });
module.exports = Books;
