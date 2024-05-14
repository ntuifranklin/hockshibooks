const express = require('express');
const { faker } = require('@faker-js/faker');
const path = require('path');
const createError = require('http-errors');

const bodyParser = require('body-parser');
const {decode} = require('html-entities');
const template_folder = 'statictemplate';
const routes = require('./routes');

const app = express();

const { stripe,testStripeProductCreation } = require('./utilities/stripe'); 

const DEV_PORT=5445 ;

const PORT = DEV_PORT ;



app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));

app.use(express.static(template_folder));
app.use(express.json());

var csrf = require('csurf');
// csrf protection
var csrfProtection = csrf({ cookie: true });
const cookieSession = require('cookie-session');
const site_secret = faker.internet.password({ length:64 });
var dynamicCookie =  {
    sameSite: 'none',
    maxAge: Number(process.env.SESSION_MAXIMUM_TIME_IN_MILLI_SECONDS),
    secure: false,
    httpOnly: false,
};


/* Prevent attackes from guessing passwords with rate limiting per IP address */
const { rateLimit } = require('express-rate-limit');

const form_rate_limiter = rateLimit({
	windowMs: 30 * 60 * 1000, // 30 minutes
	limit: 10000, // Limit each IP to 1000 requests per `window` (here, per 30 minutes).
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	// store: ... , // Use an external store for consistency across multiple server instances.

});
app.use(form_rate_limiter); 
/* If in a production environment, then use un secure cookies */


var isTestingEnv = isTestEnvironment(root_dir=new String(__dirname));
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
    app.use(cookieParser(site_secret, dynamicCookie));
} else {
     
    app.set('trust proxy', 0) // trust first proxy
    dynamicCookie.secure = false; // we do not need to serve secure cookies
    dynamicCookie.sameSite = 'strict';
    dynamicCookie.httpOnly = false;
    app.use(cookieParser(site_secret, dynamicCookie));
} ;

var parseForm = bodyParser.urlencoded({ extended: false });
app.use(bodyParser.urlencoded({extended: true}));

app.use(parseForm, csrfProtection, async(request, response, next) => { 
    	/*
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
	*/
    
    return next();
});

app.use('/',routes());

//exporting app for testing
module.exports = app.listen(PORT, () => {
    console.log(`Express server listening on port ${PORT}`);
   
});


