const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const customerModel=require("./customerModel")


const bcrypt = require('bcrypt');
const crypto = require('crypto');

class Order extends Model {}

Order.init({
  order_id: {
    type: DataTypes.STRING(64),
    
    primaryKey: true,
    defaultValue:DataTypes.UUIDV4,   
    allowNull: false,
  },
  customer_id: {
    type: DataTypes.STRING(64),
    allowNull: false,
  },
  order_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  total_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  payment_status: {
    type: DataTypes.ENUM('Pending', 'Paid', 'Cancelled'),
    allowNull: false,
  },
  shipping_address: {
    type: DataTypes.STRING(256),
    allowNull: false,
  },
  shipping_city: {
    type: DataTypes.STRING(128),
    allowNull: false,
  },
  shipping_state_province: {
    type: DataTypes.STRING(128),
    allowNull: false,
  },
  shipping_country: {
    type: DataTypes.STRING(128),
    allowNull: false,
  },
  shipping_postal_code: {
    type: DataTypes.STRING(32),
    allowNull: false,
  },
  delivery_status: {
    type: DataTypes.ENUM('Processing', 'Shipped', 'Delivered'),
    allowNull: false,
  }
}, {
  sequelize,
  modelName: 'Order',
  tableName: 'Orders',
  timestamps: false,
  hooks: {
    beforeCreate: async (order) => {
           /**
     * Hook to generate a order_id before creating a new order.
     *
     */
    console.log("before create")
      if (!order.order_id) {
           order.order_id =  await crypto.createHash('md5').update(Math.random().toString()).digest('hex');
      }
    },beforeUpdate: async (order) => {
         /**
     * Hook to generate a order_id before updating an existing order.
     *
     */
        if (!order.order_id) {
          
           order.order_id = await crypto.createHash('md5').update(Math.random().toString()).digest('hex');
        }
        }
      }
});


module.exports = Order;