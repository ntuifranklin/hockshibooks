// models/customer.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcrypt');
const {Md5Rand}=require("../utilities/functions")
const crypto = require('crypto');

const Order= require("./ordersModel")


const Customer = sequelize.define('Customer', {
    customer_id: {
        type: DataTypes.UUIDV4,
        primaryKey: true,
    },
    first_name: {
        type: DataTypes.STRING(64),
        allowNull: true,
    },
    last_name: {
        type: DataTypes.STRING(64),
        allowNull: true,
    },
    email: {
        type: DataTypes.STRING(64),
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING(256),
        allowNull: true,
    },
    guest: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false, 
      },
    street_address: {
        type: DataTypes.STRING(256),
        allowNull: true,
    },
    city: {
        type: DataTypes.STRING(128),
        allowNull: true,
    },
    state_province: {
        type: DataTypes.STRING(128),
        allowNull: true,
    },
    country: {
        type: DataTypes.STRING(128),
        allowNull: true,
    },
    postal_zipcode: {
        type: DataTypes.STRING(32),
        allowNull: true,
    },
    phone: {
        type: DataTypes.STRING(32),
        allowNull: true,
    }
    
}, {
    timestamps: false,
    tableName: 'Customers',
    hooks: {
        beforeCreate: async (user) => {
          // Hash the password before creating a new powerUser.
          if (user.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
            }
          user.customer_id=crypto.createHash('md5').update(Math.random().toString()).digest('hex')
        },
        beforeUpdate: async (user) => {
          // Hash the password before updating an existing powerUser.
            console.log("raw: "+user.password)
            console.log("                                                             ")

            console.log(user)
          if (user.password) {

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);

            console.log("hased"+user.password)

          }
        },
        
      }
  
      
});


Customer.hasMany(Order, { foreignKey: 'customer_id' });
Order.belongsTo(Customer, { foreignKey: 'customer_id' });


module.exports = Customer;
