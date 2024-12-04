require("dotenv").config()
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
const cookieParser=require('cookie-parser');
let csrfProtection = csrf({ cookie: true });
const Redis = require('ioredis');
const {RedisStore} = require('connect-redis');
const {createClient} = require('redis');

const { rateLimit } = require('express-rate-limit');


const sequelize = require('./config/database');
const validateOTP=require("./middleware/OTPmiddleware")
const { 
	initializeRedisClient, 
	setRedisLoggedInUserCacheMiddleware, 
	setRedisUserCartCacheMiddleware, 
	redisCacheMiddleware, 
	createUniqueUserRedisKey,
	REDIS_CONNECTION_OPTIONS
} = require('./middleware/redis');
const { ADD_CART_QUANTITY, SUBTRACT_CART_QUANTITY, REMOVE_CART_ITEM, USER_CART_NAME, USER_KEY_NB_BYTES } = require('./utilities/universal_web_constants');


const { stripe,testStripeProductCreation } = require('./utilities/stripe'); 


const { v4: uuidv4 } = require('uuid');

let parseForm = bodyParser.urlen

// const DEV_PORT=5445 ;

// let PORT = process.env.NODE_ENV=="test"?4000:3000 ;
const env = process.env.NODE_ENV||"development";
const port = env == "test" ? process.env.TEST_PORT : process.env.PRODUCTION_SITE_PORT;


process.env.ROOT_PATH=path.join(__dirname, './');

//connects to the database
connect()
//checks if the uploads dir exists, this dir is where all our cover images will be stored
checkUploadDir()

//middleware

const site_secret = faker.internet.password({ length:128 });

/* Prevent attackes from guessing passwords with rate limiting per IP address */
const form_rate_limiter = rateLimit({
	windowMs: 30 * 60 * 1000, // 30 minutes
	limit: 10000, // Limit each IP to 1000 requests per `window` (here, per 30 minutes).
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	// store: ... , // Use an external store for consistency across multiple server instances.
});
 

let redisClient ;
async function startNewHockshiServer(){
	
	const app = express();

	app.set('view engine', 'ejs');
	app.use(express.static(path.join(__dirname, './views')));
	app.set('views', path.join(__dirname, './views'));
	app.use(express.json());
	app.use(cookieParser())

	app.use(csrfProtection);
	app.use(bodyParser.urlencoded({extended: true}));

	app.use(form_rate_limiter); 


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
	app.locals.linkedinpage = process.env.LINKEDIN_PAGE;
	

	
	//start redis cache
	await initializeRedisClient();
	//redisStore = new RedisStore({ client: redisClient });	
	app.use(session({
		secret:site_secret,
		resave: false,
		saveUninitialized: false,
		cookie:{
			secure: process.env.NODE_ENV === 'production'? "true":"auto",	// serve secure cookies
			httpOnly: true,
			maxAge: Number(process.env.SESSION_MAXIMUM_TIME_IN_MILLI_SECONDS),
			sameSite: process.env.NODE_ENV == 'production' ? 'none' : 'lax',
		},																				
		
	}));


	app.use(async(req, res, next) => {
				
		res.locals = app.locals ;
		req.locals = app.locals ;
		res.locals.csrfToken = req.csrfToken();
		res.removeHeader("X-Powered-By");
		const valid_cart_actions = [ADD_CART_QUANTITY, SUBTRACT_CART_QUANTITY, REMOVE_CART_ITEM];
		req.locals.valid_cart_actions = valid_cart_actions ;


		//assign unique identifier
		if (!req.session.userID) {
			console.log(`current Session ID Generated: ${req.sessionID}`);
			req.session.userID = await createUniqueUserRedisKey(length=USER_KEY_NB_BYTES);
			console.log(`Unique User ID Generated: ${req.session.userID}`);
			req.session.save();
		} ;
		if (!req.session.cart) {
			req.session.cart = {} ;
		} ;
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


