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

app.use( async(request, response, next) => { 
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


