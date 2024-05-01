const express = require('express');
const router = express.Router();

require('dotenv').config();

const {stripe} = require('../utilities/stripe') ;

const calculateOrderAmount = (items) => { 

// Replace this constant with a calculation of the order's amount
// Calculate the order total on the server to prevent

// people from directly manipulating the amount on the client
return 1400;                                                                

};

exports.calculateOrderAmount = calculateOrderAmount ;

module.exports = () => { 
        
    router.get(['/','/checkout'], async (request, response, next) => { 
        
        //console.log(`User cart : ${JSON.stringify(userCart)}`);
	const stripe_public_key = process.env.STRIPE_PUBLIC_KEY;
        response.render('layout', 
	{
		template:'checkout',
		stripe_public_key:stripe_public_key,
	});
        return ;
        
   });

   
  router.get('/successpayment', async(request, response, next)=>{
	response.render('layout',
	{
		template:'successpayment',
		successmessage:"Congratulations! Your payment was a success!",
	});
  });

  router.post("/create-payment-intent", async (request, response,next) => {
    const { items } = request.body;

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: calculateOrderAmount(items),
      currency: "usd",
      // In the latest version of the API, specifying the `automatic_payment_methods` 
      // parameter is optional because Stripe enables its functionality by default.
      automatic_payment_methods: {
        enabled: true,
      },
    });

    response.send({
      clientSecret: paymentIntent.client_secret,
    });
  });

      
  return router;

};

