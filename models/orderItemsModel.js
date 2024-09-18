const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const orderModel=require("./ordersModel")
const booksModel=require("./bookModel")

const bcrypt = require('bcrypt');
const crypto = require('crypto');

class OrderItem extends Model {}

OrderItem.init({
  order_item_id: {
    type: DataTypes.STRING(64),
    primaryKey: true,
  },
  order_id: {
    type: DataTypes.STRING(64),
    allowNull: false,
  },
  book_id: {
    type: DataTypes.STRING(64),
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  item_price: {
    type: DataTypes.DECIMAL(16, 2),
    allowNull: false,
  },
  subtotal: {
    type: DataTypes.DECIMAL(16, 2),
    allowNull: false,
  }
}, {
  sequelize,
  modelName: 'OrderItem',
  tableName: 'Order_Items',
  timestamps: false,
  hooks: {
    beforeCreate: async (order_item) => {
           /**
     * Hook to generate a book_id before creating a new book.
     *
     */
      if (!order_item.order_item_id) {
        order_item.order_item_id =  await crypto.createHash('md5').update(Math.random().toString()).digest('hex');
      }
    },beforeUpdate: async (order_item) => {
         /**
     * Hook to generate a book_id before updating an existing book.
     *
     */
        if (!order_item) {
          
          order_item.order_item_id = await crypto.createHash('md5').update(Math.random().toString()).digest('hex');
        }
        }
      }
});

orderModel.hasMany(OrderItem, { foreignKey: 'order_id' });
OrderItem.belongsTo(orderModel, { foreignKey: 'order_id' });


module.exports = OrderItem;