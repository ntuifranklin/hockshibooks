const { Sequelize, DataTypes, Model } = require('sequelize');

const sequelize=require("../config/database")

const Book = require('./bookModel'); // Import Book model to establish the association

const Genre = require('./genreModel'); // Import Category model to establish the association

class BooksGenres extends Model {} ;

BooksGenres.init({
    book_genre_id: {
        type: DataTypes.STRING(64),
        primaryKey: true,
        allowNull: false,
        
    },
    book_id: {
        type: DataTypes.STRING(64),
        primaryKey: true,
        references: {
            model: Book,
            key: 'book_id'
        }
    },
    genre_id: {
        type: DataTypes.STRING(64),
        primaryKey: true,
        references: {
            model: Genre,
            key: 'genre_id'
        }
    }
    
}, {
    sequelize,
    modelName: 'BooksGenres',
    tableName: 'BooksGenres',
    timestamps: false,
    
    hooks: {
        beforeCreate: async (booksGenres) => {
          if (!booksGenres.book_genre_id) {
            let book_genre_id ;
            let isUnique = false;
            
            while (!isUnique) {
                
                book_genre_id =  await crypto.createHash('md5').update(Math.random().toString()).digest('hex').substr(0, 64);
                let exisitingBooksGenres = await BooksGenres.findOne({ where: { book_genre_id: book_genre_id } });
                if (!exisitingBooksGenres) {
                    booksGenres.book_genre_id = book_genre_id;
                    isUnique = true;
                }
            }
            
          }
        },beforeUpdate: async (booksGenres) => {
            
          if (!booksGenres.book_genre_id) {
            let book_genre_id ;
            let isUnique = false;
            
            while (!isUnique) {
                
                book_genre_id =  await crypto.createHash('md5').update(Math.random().toString()).digest('hex').substr(0, 64);
                let exisitingBooksGenres = await BooksGenres.findOne({ where: { book_genre_id: book_genre_id } });
                if (!exisitingBooksGenres) {
                    booksGenres.book_genre_id = book_genre_id;
                    isUnique = true;
                }
            }
            
          }
        }
      },
    
});

// Establish the association
BooksGenres.hasMany(Book, { foreignKey: 'book_id' });
BooksGenres.hasMany(Genre, { foreignKey: 'genre_id' });
Book.belongsToMany(BooksGenres, { foreignKey: 'book_id' });

module.exports = BooksGenres;