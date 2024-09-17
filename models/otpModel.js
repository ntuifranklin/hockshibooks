const {Sequelize,DataTypes,Model}= require('sequelize')
const bcrypt = require('bcrypt');
const sequelize = require('../config/database');


const adminModel=require("./adminModel") //import the admin model




//powerUser model
class otpTable extends Model{}
otpTable.init({
    
    id:{
        type:DataTypes.UUID,
        primaryKey:true,
        defaultValue:DataTypes.UUIDV4   
    },
    
    otp:DataTypes.STRING,
    expiration_time:DataTypes.DATE,
    powerUserId:{
          
        type:DataTypes.UUIDV4,
        references:{
            model:adminModel,
            key:'id'
        }
    }
     },{
        sequelize,
        tableName: 'otpTable',
        timestamps:false

    }
    
)
adminModel.hasMany(otpTable)
otpTable.belongsTo(adminModel)


module.exports=otpTable