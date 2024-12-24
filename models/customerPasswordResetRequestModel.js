const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Customer = require('./customerModel');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
class CustomerPasswordResetRequest extends Model {}

CustomerPasswordResetRequest.init({
    id: {
        type: DataTypes.UUIDV4,
        primaryKey: true
    },
    customer_id: {
        type: DataTypes.UUIDV4,
        allowNull: false,
        references: {
            model: Customer,
            key: 'customer_id'
        }
    },
    token: {
        type: DataTypes.STRING(64),
        allowNull: true
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    expires_at: {
        type: DataTypes.DATE,
        allowNull: false
    },
    used: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    sequelize,
    modelName: 'CustomerPasswordResetRequest',
    tableName: 'Customer_password_reset_requests',
    //create a hook to create a secure token for the customer that ends up being at most 255
    //characters long
    hooks: {
        beforeCreate: async (customerPasswordResetRequest) => {
           

            let isUnique = false;
            let id ;
            while (!isUnique) {
                
                id = crypto.createHash('md5').update(Math.random().toString()).digest('hex')
                let exisitingCustomerPasswordResetRequest = await CustomerPasswordResetRequest.findOne({ where: { id: id } });
                if (!exisitingCustomerPasswordResetRequest) {
                    customerPasswordResetRequest.id = id;
                    isUnique = true;
                }
            }
            customerPasswordResetRequest.token = crypto.randomBytes(64).toString('hex').substring(0, 64);
           
        }
    },

    timestamps: false
});
//Add one to many relationship
CustomerPasswordResetRequest.belongsTo(Customer, { foreignKey: 'customer_id' });
Customer.hasMany(CustomerPasswordResetRequest, { foreignKey: 'customer_id' });

module.exports = CustomerPasswordResetRequest;