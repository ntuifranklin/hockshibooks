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
const { createCanvas, loadImage } = require('canvas');
const {
  ORDER_STATUS_PROCESSING,
  ORDER_STATUS_SHIPPED,
  ORDER_STATUS_DELIVERED
} = require('./universal_web_constants');
require("dotenv").config()

function setDatabaseEnvironment() {
  
const env = process.env.NODE_ENV || process.env.DEVELOPMENT_ENV;
/* This has to be done before any database connection is made */

  if (env == process.env.PRODUCTION_ENV) {
    process.env.DB_USER = process.env.DB_PROD_USER;
    process.env.DB_PSWD = process.env.DB_PROD_PASSWORD;
    process.env.DB_NAME = process.env.DB_PROD_DB_NAME;
    process.env.DB_HOST = process.env.DB_PROD_HOST;
  } else if (env == process.env.TEST_ENV) {
    process.env.DB_USER = process.env.DB_TEST_USER;
    process.env.DB_PSWD = process.env.DB_TEST_PASSWORD;
    process.env.DB_NAME = process.env.DB_TEST_DB_NAME;
    process.env.DB_HOST = process.env.DB_TEST_HOST;
  } else if (env == process.env.DEVELOPMENT_ENV) {
    process.env.DB_USER = process.env.DB_DEV_USER;
    process.env.DB_PSWD = process.env.DB_DEV_PASSWORD;
    process.env.DB_NAME = process.env.DB_DEV_DB_NAME;
    process.env.DB_HOST = process.env.DB_DEV_HOST;
  } else {
    process.exit(1);
  } ;
  
    /* print current settings 
    console.log("Current settings: ");
    console.log("DB_USER: ", process.env.DB_USER);
    console.log("DB_PSWD: ", process.env.DB_PSWD);
    console.log("DB_NAME: ", process.env.DB_NAME);
    console.log("DB_HOST: ", process.env.DB_HOST);
    console.log(
      `Environment not set for database settings, 
      please set the environment variable NODE_ENV to either production, 
      testing or development`
    );
    */
    
} ;


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
    console.log('Database with [sequelize] Connection established successfully.');
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
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // OTP valid for 5 minutes
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

const sendStatusChangedMessage=async(order,status, orderToSendAsEmail=[], customer={})=>{
  /**
 * Sends an email to the customer with the updated order status.
 *
 * @param {Object} order - The order object containing the customer ID and order ID.
 * @param {string} status - The updated status of the order.
 * @return {Promise<void>} A Promise that resolves when the email is sent successfully.
 * @throws {Error} If there is an error sending the email.
 */
  if (customer == null || !customer || customer == {}) {

    customer= await customerModel.findOne({
      where:{
        customer_id:order.customer_id
      }
    })
  }
 


  const email = new Email();    

  try{
      
    let templatePath;
    if (status === ORDER_STATUS_PROCESSING || 
      status === ORDER_STATUS_DELIVERED || 
      status === ORDER_STATUS_SHIPPED) {
      templatePath = path.join(process.env.ROOT_PATH, 'views','EmailTemplates' ,'orderStatusChangedTemplate.ejs');
    } else {  
      throw new Error('Invalid order status');
    } ;
    //console.log(`\tTemplate path: ${templatePath}`);
    templatePath = path.normalize(templatePath);
    //console.log(`\tTemplate path: ${templatePath}`);
    const html = await ejs.renderFile(templatePath,{
        emailTitle: 'Order Status Changed',
        customerName: `${customer.first_name}`,
        orderId: `${order.order_id}`,
    });
    await email.sendEmail(customer.email, 'Order Status Change', html) ;
    //console.log(`Email sent successfully in ${__filename} : ${JSON.stringify(html)}`);

  }
  catch(e){
    console.log("email error" , e)
  };
} ;
const sendCustomerNewOrderEmailNotofication=async(order, orderToSendAsEmail=[], customer={})=>{
  /**
 * Sends an email to the customer with the updated order status.
 *
 * @param {Object} order - The order object containing the customer ID and order ID.
 * @return {Promise<void>} A Promise that resolves when the email is sent successfully.
 * @throws {Error} If there is an error sending the email.
 */
  if (customer == null || !customer || customer == {}) {

    customer= await customerModel.findOne({
      where:{
        customer_id:order.customer_id
      }
    })
  }
 
  const email = new Email();    

  try{
      
    let templatePath = path.join(process.env.ROOT_PATH, 'views','EmailTemplates' ,'customerNewOrderEmailNotification.template.ejs');
    //console.log(`\tTemplate path: ${templatePath}`);
    templatePath = path.normalize(templatePath);
    //console.log(`\tTemplate path: ${templatePath}`);
    
    let ejsData = {
      emailTitle: `${customer.first_name || 'Guest User'}, your order was received`,
      customerName: `${customer.first_name}`,
      orderId: `${order.order_id}`,
      orderList: orderToSendAsEmail,
      shippingAddress: order.shipping_address,
      shippingCity: order.shipping_city || '',
      shippingState: order.shipping_state_province,
      shippingCountry: order.shipping_country,
      shippingPostalCode: order.shipping_postal_code,
      totalAmount: order.total_amount,
      companyName: process.env.COMPANY_NAME,
      termsAndConditionsLink: process.env.WEBSITE_URL + "/docs/terms-and-conditions",
      privacyPolicyLink: process.env.WEBSITE_URL + "/docs/policy",
  };
    const html = await ejs.renderFile(templatePath,ejsData);
    await email.sendEmail(customer.email, ejsData.emailTitle, html) ;
    //console.log(`Email sent successfully in ${__filename} : ${JSON.stringify(html)}`);

  }
  catch(e){
    console.log("email error" , e)
  };
};

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
};



/*
  This function creates a default image for a book with the specified title.
  The image is saved to the uploads directory and the filename is returned.
  If no title is provided, the image will have a default title.
  The image dimensions can also be specified.
*/
const createDefaultBookImage=async (width=300, height=300, imageTitle='default-image')=>{
  
const canvas = createCanvas(width, height);
const context = canvas.getContext('2d');

// Fill background
context.fillStyle = '#dcb14a'; // website brand color for background
context.fillRect(0, 0, width, height);

//writing px should be about 7% of the image width
let writePx = Math.ceil(width * 0.07);
// Add text
context.font = `${writePx}px Arial`;
context.fillStyle = '#000000'; // Black text
//write 15 characters for every line of the image title to the image
const lines = [];
let line = '';
const words = imageTitle.split('-');
for (let i = 0; i < words.length; i++) {
  if (line.length + words[i].length <= 15) {
    line += words[i] + ' ';
  } else {
    lines.push(line);
    line = words[i] + ' ';
  }
}
lines.push(line);
//start at about 25% of the image width and 25% of the image height
let startX = Math.round(width * 0.25);
let startY = Math.round(height * 0.25);
for (let i = 0; i < lines.length; i++) {
  context.fillText(lines[i], startX, startY + i * writePx);
}


// Save image to file
const buffer = canvas.toBuffer('image/jpeg');
let imageFilename = imageTitle + '.jpg';

const uploadsDir = path.join(process.env.ROOT_PATH, 'views/uploads');
fs.writeFileSync(uploadsDir + '/' + imageFilename, buffer);

return imageFilename;

}
module.exports={
  createDefaultBookImage,
  sendCustomerNewOrderEmailNotofication,
  sendStatusChangedMessage,
  convertDateFormat,
  connect,
  isTestEnvironment,
  generateAndSendOTP,
  Md5Rand,
  checkFileExtension,
  checkUploadDir,
  getBookDescription,
  setDatabaseEnvironment
}

