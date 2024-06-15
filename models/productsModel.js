const { Sequelize, DataTypes, Model } = require('sequelize');
const sequelize=require("../config/database")
const {Md5Rand}=require("../utilities/functions")
const crypto = require('crypto');


const category = require('./categoryModel'); // Import category model

class Products extends Model {}

Products.init({
    product_id: {
        type: DataTypes.STRING(64),
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(512),
        allowNull: false
    },
    
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    
    
    product_image_url: {
        type: DataTypes.STRING(1024)
    },
    category: {
        type: DataTypes.STRING(64),
        references: {
            model: category,
            key: 'category_id'
        }
    }
}, {
    sequelize,
    modelName: 'Products',
    tableName: 'Products',
    hooks: {
        beforeCreate: async (products) => {
               /**
         * Hook to generate a product_id before creating a new products.
         *
         */
          if (!products.product_id) {
               products.product_id =  await crypto.createHash('md5').update(Math.random().toString()).digest('hex');
          }
        },beforeUpdate: async (products) => {
             /**
         * Hook to generate a product_id before updating an existing products.
         *
         */
            if (!products.product_id) {
              
               products.product_id = await crypto.createHash('md5').update(Math.random().toString()).digest('hex');
            }
            }
            },
            timestamps: false,
    },
  
);

// Establish the association~
Products.belongsTo(category, { foreignKey: 'category' });
category.hasMany(Products, { foreignKey: 'category' });


 
module.exports = Products;
