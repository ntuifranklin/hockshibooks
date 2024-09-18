const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize=require("../config/database")
const {Md5Rand}=require("../utilities/functions")

class Genre extends Model {}

Genre.init({
    genre_id: {
        type: DataTypes.STRING(64),
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(128),
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Genre',
    tableName: 'Genres',
    timestamps: false,
    hooks: {
      beforeCreate: async (genre) => {
        if (!genre.genre_id) {
             genre.book_id =  await crypto.createHash('md5').update(Math.random().toString()).digest('hex');
        }
      },beforeUpdate: async (genre) => {
          if (!genre.genre_id) {
            
             genre.book_id = await crypto.createHash('md5').update(Math.random().toString()).digest('hex');
          }
          }
          },
});

module.exports = Genre;