const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const orderModel=require("./ordersModel")

const bcrypt = require('bcrypt');
const crypto = require('crypto');


class Payment extends Model {}

Payment.init({
  payment_id: {
    type: DataTypes.STRING(64),
    primaryKey: true,
  },
  order_id: {
    type: DataTypes.STRING(64),
    allowNull: false,
  },
  payment_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  payment_method: {
    type: DataTypes.STRING(128),
    allowNull: false,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  transaction_id: {
    type: DataTypes.STRING(128),
    allowNull: false,
  }
}, {
  sequelize,
  modelName: 'Payment',
  tableName: 'Payment',
  timestamps: false,
  hooks: {
    beforeCreate: async (payment) => {
           /**
     * Hook to generate a payment_id before creating a new payment.
     *
     */
      if (!payment.payment_id) {
           payment.payment_id =  await crypto.createHash('md5').update(Math.random().toString()).digest('hex');
      }
    },beforeUpdate: async (payment) => {
         /**
     * Hook to generate a payment_id before updating an existing payment.
     *
     */
        if (!payment.payment_id) {
          
           payment.payment_id = await crypto.createHash('md5').update(Math.random().toString()).digest('hex');
        }
        }
      }
});

orderModel.hasMany(Payment, { foreignKey: 'order_id' });
Payment.belongsTo(orderModel, { foreignKey: 'order_id' });

module.exports = Payment;
