const { Sequelize } = require('sequelize');
const fs = require('fs');
const path= require("path")
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const otpModel=require("../models/otpModel")
const customerModel=require("../models/customerModel")
const cusomerOtpModel=require("../models/customerOtpModel")
const nodemailerMock=require("nodemailer-mock")
const axios= require("axios");
const { Email } = require('./email');
const ejs = require('ejs');
require("dotenv").config()

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

const generateAndSendOTP=async (userId,mail,otpmodel)=>{
  /**
 * Generates and sends an OTP (One-Time Password) to the specified email address.
 * @param {string} userId - The ID of the user associated with the OTP.
 * @param {string} mail - The email address to which the OTP will be sent.
 * @returns {Promise<void>} A Promise that resolves when the OTP is successfully sent.
 */
  const otpCode = crypto.randomInt(100000, 999999).toString();
  const expiresAt = new Date(Date.now() + 1 * 60 * 1000); // OTP valid for 15 minutes
  let Transporter;
  
  console.log(otpCode)
  // Save OTP to the database
  if(otpmodel.toString()==otpModel.toString()){
  let code =await otpmodel.create({  otp:otpCode,powerUserId:userId, expiration_time:expiresAt });
  } else if(otpmodel.toString()==cusomerOtpModel.toString()){
   let code=await otpmodel.create({  otp:otpCode,customerId:userId, expiration_time:expiresAt });

  }
  const email = new Email();    

  try{
      
    let templatePath = path.join(process.env.ROOT_PATH, 'views','EmailTemplates' ,'OTPcodeTemplate.ejs');
    //console.log(`\tTemplate path: ${templatePath}`);
    templatePath = path.normalize(templatePath);
    //console.log(`\tTemplate path: ${templatePath}`);
    const html = await ejs.renderFile(templatePath,{code:otpCode});
    await email.sendEmail(mail, 'OTP code', html) ;
    //console.log(`Email sent successfully in ${__filename} : ${JSON.stringify(html)}`);

  }
  catch(e){
    console.log("email error" , e)
  }

 return otpCode
}

const sendStatusChangedMessage=async(order,status)=>{
  /**
 * Sends an email to the customer with the updated order status.
 *
 * @param {Object} order - The order object containing the customer ID and order ID.
 * @param {string} status - The updated status of the order.
 * @return {Promise<void>} A Promise that resolves when the email is sent successfully.
 * @throws {Error} If there is an error sending the email.
 */
  const customer= await customerModel.findOne({
    where:{
      customer_id:order.customer_id
    }
  })


  const email = new Email();    

  try{
      
    let templatePath = path.join(process.env.ROOT_PATH, 'views','EmailTemplates' ,'orderCompletedMessage.ejs');
    //console.log(`\tTemplate path: ${templatePath}`);
    templatePath = path.normalize(templatePath);
    //console.log(`\tTemplate path: ${templatePath}`);
    const html = await ejs.renderFile(templatePath,{
        emailTitle: 'A new order was made',
        customerName: `${customer.first_name}`,
        orderId: `${order.order_id}`,
    });
    await email.sendEmail(customer.email, 'A New Order Was Made', html) ;
    //console.log(`Email sent successfully in ${__filename} : ${JSON.stringify(html)}`);

  }
  catch(e){
    console.log("email error" , e)
  }
















  Transporter=nodemailer.createTransport({
    service:'gmail',

    auth:{
      user:process.env.EMAIL_USER,
      pass:process.env.EMAIL_PASS //google does not allow you to use your regular password for third party apps instead , you will generate an app pass , app passwords can only be generated for accounts with 2FA

    }
  });
const mailOptions = {
  from: process.env.EMAIL,
  to: customer.email,
  subject: 'Order status change',
  text: `
  dear ${customer.last_name || "geust user"}, 

  the status of your order with the id ${order.order_id} has been changed to ${status}
  
  `,
};
try{

    await Transporter.sendMail(mailOptions,()=>{
      console.log("Email sent successfully.");        });
      // console.log(otpCode)
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
const convertDateFormat = (dateString)=>{
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const dateParts = dateString.split('-');
    const year = dateParts[0];
    const month = parseInt(dateParts[1], 10) - 1;
    const day = dateParts[2];

    return `${months[month]} ${day}, ${year}`;
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
      return cb(null, true);

  } else {
        // If either extension or MIME type is invalid, invoke the callback with an error

      cb('Error: Images Only!');
  }

}

const getBookDescription= async (openLibraryId)=>{

  const url = `https://openlibrary.org/works/${openLibraryId}.json`;

    try {
        const response = await axios.get(url);
        const workData = response.data;
        return workData.description ? (typeof workData.description === 'string' ? workData.description : workData.description.value) : 'No description available';
    } catch (error) {
        console.error('Error fetching book description:', error);
        return 'No description available';
    }
}
module.exports={sendStatusChangedMessage,convertDateFormat,connect,isTestEnvironment,generateAndSendOTP,Md5Rand,checkFileExtension,checkUploadDir,getBookDescription}