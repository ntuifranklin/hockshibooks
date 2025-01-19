const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize=require("../config/database")
const {Md5Rand}=require("../utilities/functions")

class category extends Model {}

category.init({
    category_id: {
        type: DataTypes.STRING(64),
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(128),
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'category',
    tableName: 'categoriess',
    timestamps: false,
    hooks: {
      beforeCreate: async (category) => {
        if (!category.category_id) {
             category.category_id =  await crypto.createHash('md5').update(Math.random().toString()).digest('hex');
        }
      },beforeUpdate: async (category) => {
          if (!category.category_id) {
            
             category.category_id = await crypto.createHash('md5').update(Math.random().toString()).digest('hex');
          }
          }
          },
});

module.exports = category;