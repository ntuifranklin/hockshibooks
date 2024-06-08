require('dotenv').config();
const { Sequelize } = require('sequelize');
const fs = require('fs');
const path= require("path")
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const otpModel=require("../models/otpModel")


function isTestEnvironment(root_dir=new String(__dirname)) {
   
    const current_dir = root_dir;
    const PRODUCTION_ENV = new String(process.env.BBD_LOCATION);
    const TEST_ENV = new String(process.env.TEST_BBD_LOCATION);
    var isTesting = null ;
    if ( current_dir.includes(PRODUCTION_ENV) ) {
        isTesting = false ;
    } else if (current_dir.includes(TEST_ENV) ) {
        isTesting = true ;
    }

    return isTesting ;
} ;

let sequelize;


const connect = () => {
  /**
 * Function to establish a connection with the database using Sequelize.
 * @returns {Sequelize} Returns the Sequelize instance representing the database connection.
 */
  if (sequelize) {
      // Close existing connection if it exists

    sequelize.close().catch(err => console.error('Error closing old connection:', err));
  }
  // Create a new Sequelize instance

  sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PSWD, {
    host: process.env.DB_HOST,
    dialect: 'mariadb',
    logging: console.log,
  });

    // Authenticate the connection

  sequelize.authenticate().then(() => { 
    console.log('Connection established successfully.');
  }).catch(err => {
    console.error('Unable to connect to the database:', err);
  });
  // Return the Sequelize instance
  return sequelize;
};

const generateAndSendOTP=async (userId,mail)=>{
  /**
 * Generates and sends an OTP (One-Time Password) to the specified email address.
 * @param {string} userId - The ID of the user associated with the OTP.
 * @param {string} mail - The email address to which the OTP will be sent.
 * @returns {Promise<void>} A Promise that resolves when the OTP is successfully sent.
 */
  const otpCode = crypto.randomInt(100000, 999999).toString();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // OTP valid for 15 minutes
  console.log(otpCode)
  // Save OTP to the database
  connect();
  await otpModel.create({ powerUserId:userId, otp:otpCode, expiration_time:expiresAt });

    const Transporter=nodemailer.createTransport({
      service:'gmail',

      auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS //google does not allow you to use your regular password for third party apps instead , you will generate an app pass , app passwords can only be generated for accounts with 2FA

      }
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: mail,
      subject: 'Your OTP Code',
      text: `Your OTP code is ${otpCode}. It will expire in 15 minutes.`,
    };
    try{

        await Transporter.sendMail(mailOptions,()=>{
          console.log("Email sent successfully.");        });
    }
    catch(e){
      console.log("email error" , e)
    }
}

const Md5Rand=()=>{
  /**
 * Generates an MD5 hash of a random value.
 * @returns {string} The MD5 hash.
 */

   // Generate a random value
  const randomValue = Math.random().toString();

  // Generate MD5 hash of the random value
  return  crypto.createHash('md5').update(randomValue).digest('hex');
}

const checkUploadDir=()=>{
 /**
 * this function Checks if the uploads directory exists and creates it if it doesn't.
 */

  // Construct the path to the uploads directory

const uploadsDir = path.join(process.env.ROOT_PATH, 'views/uploads');
// Check if the uploads directory exists
if (!fs.existsSync(uploadsDir)) {
      // Create the uploads directory if it doesn't exist

    fs.mkdirSync(uploadsDir);
}
}
const checkFileExtension=(file, cb)=>{
  /**
 * Checks if the file extension is valid for image files (JPEG, JPG, PNG).
 * @param {object} file - The file object provided by multer.
 * @param {Function} cb - The callback function to be called with the validation result.
 */
  // Allowed extensions
  const filetypes = /jpeg|jpg|png/;
  // Check extion
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);
  // If both extension and MIME type are valid for images, return true

  if(mimetype && extname){
    console.log("file saved")
      return cb(null, true);

  } else {
        // If either extension or MIME type is invalid, invoke the callback with an error

      cb('Error: Images Only!');
  }

}
module.exports={connect,isTestEnvironment,generateAndSendOTP,Md5Rand,checkFileExtension,checkUploadDir}