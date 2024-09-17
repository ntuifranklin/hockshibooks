const {Sequelize,DataTypes,Model}= require('sequelize')
const bcrypt = require('bcrypt');
const sequelize = require('../config/database');


const customerModel=require("./customerModel") //import the admin model




//powerUser model
class customerOtpTable extends Model{}
customerOtpTable.init({
    
    id:{
        type:DataTypes.UUID,
        primaryKey:true,
        defaultValue:DataTypes.UUIDV4   
    },
    
    otp:DataTypes.STRING,
    expiration_time:DataTypes.DATE,
    customerId:{
        type:DataTypes.UUIDV4,
        references:{
            model:customerModel,
            key:'customer_id'
        }
    }
     },{
        sequelize,
        tableName: 'customerOtpTable',
        timestamps:false

    }
    
)

// customerModel.hasMany(customerOtpTable)
// customerOtpTable.belongsTo(customerModel)


module.exports=customerOtpTable