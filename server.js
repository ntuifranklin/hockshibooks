const express = require('express');
const { faker } = require('@faker-js/faker');
const path = require('path');
const createError = require('http-errors');
const {isTestEnvironment,connect,checkUploadDir}=require("./utilities/functions");
const booksRouter=require("./routes/booksRoute")
const adminRoute=require("./routes/adminRoutes")
const bodyParser = require('body-parser');
const {decode} = require('html-entities');
const template_folder = './statictemplate';
const routes = require('./routes');
const multer=require("multer")
const csrf = require('csurf');
const cookieSession = require('express-session');
const cookieParser=require('cookie-parser');
let csrfProtection = csrf({ cookie: true });

let parseForm = bodyParser.urlencoded({ extended: false });

const app = express();

const { stripe,testStripeProductCreation } = require('./utilities/stripe'); 

const DEV_PORT=5445 ;

let PORT = DEV_PORT ;


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


var isTestingEnv =isTestEnvironment(root_dir=new String(__dirname));

if ( !isTestingEnv) {
    PORT = process.env.PRODUCTION_SITE_PORT;
} else if (isTestingEnv) {
    PORT = process.env.TEST_SITE_PORT;
} else {
    throw Error("We could neither detect testing or production environment");
}
if (PORT == process.env.PRODUCTION_SITE_PORT) {
        
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





app.use(bodyParser.urlencoded({extended: true}));


app.use(cookieSession(dynamicCookie))	

app.use(cookieParser())

app.use(csrfProtection);


    	/*

app.use(parseForm, csrfProtection, async(request, response, next) => { 
	testStripeProductCreation().then(product => {
		stripe.prices.create({
		  unit_amount: 1200,
		  currency: 'usd',
		  recurring: {
			interval: 'month',
		  },
		  product: product.id,
		}).then(price => {
		  console.log('Success! Here is your starter subscription product id: ' + product.id);
		  console.log('Success! Here is your starter subscription price id: ' + price.id);
		});
	});
    
    return next();
});
	*/



	app.use((req, res, next) => {
		res.locals.csrfToken = req.csrfToken();
		res.locals.host=process.env.HOST

		if(req.session.user){
			res.locals.user=req.session.user
		}
		next();
	});


app.use('/',routes());
app.use ("/admin",adminRoute)
app.use("/admin/books",booksRouter)

//exporting app for testing
app.listen(PORT, () => {
    console.log(`Express server listening on port ${PORT}`);
   
})
module.exports={app};


