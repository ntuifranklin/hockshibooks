const {Sequelize,DataTypes,Model}= require('sequelize')
const bcrypt = require('bcrypt');
const crypto = require('crypto');


const sequelize = require('../config/database');



//powerUser model
class powerUser extends Model{}
// Define the powerUser model with its attributes and options

powerUser.init({
    id:{
      type: DataTypes.UUIDV4,
      primaryKey: true
    },
    email:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false
    },
    role:{
        type:DataTypes.ENUM("basic_admin","super_admin"),
        defaultValue:"basic_admin",
        allowNull:false
    }},
    {
        sequelize,
        modelName: 'powerUser',  
        timestamps: false,

        indexes: [
          {
            unique: true,
            fields: ['email']
          }
        ],
    hooks: {
      beforeCreate: async (user) => {
        // Hash the password before creating a new powerUser.
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
          }
        user.id=await crypto.createHash('md5').update(Math.random().toString()).digest('hex')
      },
      beforeUpdate: async (user) => {
        // Hash the password before updating an existing powerUser.

        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      
    }

    }
    
)

module.exports=powerUser