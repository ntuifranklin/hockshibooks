
const express = require('express');
const { faker } = require('@faker-js/faker');
const path = require('path');
const createError = require('http-errors');
const {isTestEnvironment,connect,checkUploadDir}=require("./utilities/functions");

const bodyParser = require('body-parser');
const {decode} = require('html-entities');
const template_folder = './statictemplate';
const routes = require('./routes');
const multer=require("multer")
const csrf = require('csurf');
const cookieSession = require('express-session');
const cookieParser=require('cookie-parser');
let csrfProtection = csrf({ cookie: true });

//controllers
require("dotenv").config()

let parseForm = bodyParser.urlencoded({ extended: false });

const app = express();

const { stripe,testStripeProductCreation } = require('./utilities/stripe'); 

// const DEV_PORT=5445 ;

// let PORT = process.env.NODE_ENV=="test"?4000:3000 ;
const env = process.env.NODE_ENV||"dev";
const port = env == "test" ? process.env.TEST_PORT : process.env.PRODUCTION_SITE_PORT;


const sequelize = require('./config/database');
process.env.ROOT_PATH=path.join(__dirname, './');

//connects to the database
connect()
//checks if the uploads dir exists, this dir is where all our cover images will be stored
checkUploadDir()
//models
const powerUser= require("./models/adminModel")
const otpModel=require("./models/otpModel")
const bookModel=require("./models/bookModel")
const genreModel=require("./models/genreModel")
const inventoryModel=require("./models/inventory")


//middleware

const validateOTP=require("./middleware/OTPmiddleware")

//multer config

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, './views')));
app.set('views', path.join(__dirname, './views'));
app.use(express.json());


const site_secret = faker.internet.password({ length:64 });
let dynamicCookie =  {
    sameSite: 'none',
	secret:site_secret,
	cookie:{

		maxAge: Number(process.env.SESSION_MAXIMUM_TIME_IN_MILLI_SECONDS),
	},																				
    secure: false,
    httpOnly: false,
	resave: false,
  saveUninitialized: false
};

// csrf protection

/* Prevent attackes from guessing passwords with rate limiting per IP address */
const { rateLimit } = require('express-rate-limit');
const { serialize } = require('v8');

const form_rate_limiter = rateLimit({
	windowMs: 30 * 60 * 1000, // 30 minutes
	limit: 10000, // Limit each IP to 1000 requests per `window` (here, per 30 minutes).
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	// store: ... , // Use an external store for consistency across multiple server instances.

});
app.use(form_rate_limiter); 
/* If in a production environment, then use un secure cookies */


// var isTestingEnv =isTestEnvironment(root_dir=new String(__dirname));

// if ( !isTestingEnv) {
//     PORT = process.env.PRODUCTION_SITE_PORT;
// } else if (isTestingEnv) {
//     PORT = process.env.TEST_SITE_PORT;
// } else {
//     throw Error("We could neither detect testing or production environment");
// }
if (port == process.env.PRODUCTION_SITE_PORT) {
        
    app.set('trust proxy', 1) // trust first proxy
    dynamicCookie.secure = true; // serve secure cookies
    dynamicCookie.sameSite = 'strict';
    dynamicCookie.httpOnly = true;
} else {
     
    app.set('trust proxy', 0) // trust first proxy
    dynamicCookie.secure = false; // we do not need to serve secure cookies
    dynamicCookie.sameSite = 'strict';
    dynamicCookie.httpOnly = false;
} ;



app.locals.companyName = process.env.COMPANY_NAME;
app.locals.companyCity = process.env.COMPANY_CITY;
app.locals.companyState = process.env.COMPANY_STATE;
app.locals.companyZip = process.env.COMPANY_ZIP;
app.locals.websiteUrl = process.env.WEBSITE_URL ;
app.locals.companyPhoneNumber = process.env.COMPANY_PHONE_NUMBER;
app.locals.customerBusinessEmail = process.env.CUSTOMER_BUSINESS_EMAIL;
app.locals.companyAddress = process.env.COMPANY_ADDRESS;
app.locals.facebookpage = process.env.FACEBOOK_PAGE;
app.locals.xpage = process.env.X_PAGE;
app.locals.instagrampage = process.env.INSTAGRAM_PAGE;
app.locals.linkedinpage = process.env.LINKEDIN_PAGE



app.use(bodyParser.urlencoded({extended: true}));


app.use(cookieSession(dynamicCookie))	

app.use(cookieParser())

app.use(csrfProtection);


app.use((req, res, next) => {
	res.locals.csrfToken = req.csrfToken();
	res.locals.host=process.env.HOST
	if(req.session.user!=false){
		res.locals.user=req.session.user

	}
	if(req.session.customer!=false){
		res.locals.customer=req.session.customer

	}

		
	next();
});


app.use('/',routes());


app.listen(port, () => {
    console.log(`Express server listening on port ${port}`);
   
})
module.exports={app};


