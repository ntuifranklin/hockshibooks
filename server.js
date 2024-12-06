
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
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const {mysq_store_session_database_options} = require('./sessionmanagement/session');
const cookieParser=require('cookie-parser');
let csrfProtection = csrf({ cookie: true });

const RedisStore = require('connect-redis');
const { v4: uuidv4 } = require('uuid');

//controllers
require("dotenv").config()

let parseForm = bodyParser.urlencoded({ extended: false });

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

//middleware

const validateOTP=require("./middleware/OTPmiddleware")


const site_secret = process.env.SITE_SECRET;
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
const { 
	setUniqueUserID,
	initializeRedisClient, 
	setRedisLoggedInUserCacheMiddleware, 
	setRedisUserCartCacheMiddleware, 
	redisCacheMiddleware 
} = require('./middleware/redis');
const { ADD_CART_QUANTITY, SUBTRACT_CART_QUANTITY, REMOVE_CART_ITEM, USER_CART_NAME } = require('./utilities/universal_web_constants');

const request_rate_limiter = rateLimit({
	windowMs: 30 * 60 * 1000, // 30 minutes
	limit: 1000, // Limit each IP to 1000 requests per `window` (here, per 30 minutes).
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	// store: ... , // Use an external store for consistency across multiple server instances.
});

let mysqlSessionStore = new MySQLStore(mysq_store_session_database_options);

async function startNewHockshiServer(){
	
	const app = express();

	//start redis cache
	await initializeRedisClient();
	app.set('view engine', 'ejs');
	app.use(express.static(path.join(__dirname, './views')));
	app.set('views', path.join(__dirname, './views'));
	app.use(express.json());

	app.use(request_rate_limiter); 

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
	//<%= companyCity  %> <%= companyState  %>, <%= companyZip %>
	app.locals.companyAddress = process.env.COMPANY_CITY + " " + process.env.COMPANY_STATE + ", " + process.env.COMPANY_ZIP;
	app.locals.facebookpage = process.env.FACEBOOK_PAGE;
	app.locals.xpage = process.env.X_PAGE;
	app.locals.instagrampage = process.env.INSTAGRAM_PAGE;
	app.locals.linkedinpage = process.env.LINKEDIN_PAGE;
	//Terms and conditions
	app.locals.minimumUserAge = process.env.MINIMUM_USER_AGE;
	app.locals.companyJurisdiction = process.env.COMPANY_JURISDICTION;
	app.use(bodyParser.urlencoded({extended: true}));

	//app.use(dynamicCookie)	
	app.use(session({
		secret: site_secret, // Replace with a secure secret key
		resave: false, // Prevents session from being saved on every request
		saveUninitialized: false, // Ensures session is saved only when modified
		cookie: { maxAge: Number(process.env.SESSION_MAXIMUM_TIME_IN_MILLI_SECONDS) }, // 1-day cookie
		store: mysqlSessionStore,
	  }));

	app.use(cookieParser())

	app.use(csrfProtection);
	
	//generate a unique web visitor user id for each user
	app.use(setUniqueUserID);
	app.use((req, res, next) => {
				
		res.locals = app.locals ;
		req.locals = app.locals ;
		res.locals.csrfToken = req.csrfToken();
		res.removeHeader("X-Powered-By");
		const valid_cart_actions = [ADD_CART_QUANTITY, SUBTRACT_CART_QUANTITY, REMOVE_CART_ITEM];
		req.locals.valid_cart_actions = valid_cart_actions ;

		//console.log(`Request process ID: ${process.pid}.`);
		console.log(`User ID: ${req.session.userID}`);
		
		//console.log(req.headers['user-agent']);
		//log userID
		//console.log(`session userID: ${req.session.userID}`);
		req.session.someTypeOfCounter = req.session.someTypeOfCounter + 1 ;	
		//console.log(`Some type of counter: ${req.session.someTypeOfCounter}`);
		
		req.session.save();
		next();
	});


	/*
		The function below saves any api that returns json in redis cache
		 then returns it faster instead of requesting it each time.
	*/
	app.use('/',routes());
	app.listen(port, () => {
		console.log(`One hockshi worker server listening on port ${port}`);
	}) ;

	return app ;
} ;

module.exports = {
	startNewHockshiServer
}


