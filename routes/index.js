const express = require('express');
const router = express.Router();

require('dotenv').config();
const csrf = require('csurf');
let csrfProtection = csrf({ cookie: true });

const {
  showHomePage,
  bookDetail,
  viewCart,
  getCartItems,
  searchBook,
  loginPage,
  signupPage,
  signupPost,
  loginPagePost,
  checkout,
  successPayment,
  verifyOTP,
logout
}= require("../controllers/indexController");
const customerSignupValidation = require('../middleware/customerSignupValidation');
const verifyUser= require("../middleware/verifyUser")
const shippingInfoValidation=require("../middleware/shipping-infoValidation")

// const {stripe} = require('../utilities/stripe') ;


const calculateOrderAmount = (items) => { 

// Replace this constant with a calculation of the order's amount
// Calculate the order total on the server to prevent

// people from directly manipulating the amount on the client
return 50;                                                                

};

exports.calculateOrderAmount = calculateOrderAmount ;

router.get("/",showHomePage)

router.get("/productDetails/:id",bookDetail)

router.get("/cart",viewCart)

router.post("/cart",getCartItems)

router.get("/login",loginPage)

router.post("/login",loginPagePost)
router.post("/search",searchBook)


router.post("/verifyOTP",verifyOTP)

router.get("/signup",signupPage)

router.post("/signup",customerSignupValidation,signupPost)

router.post( '/checkout',verifyUser,shippingInfoValidation,checkout)

router.get("/success",successPayment)

router.get("/logout",logout)
  // router.get('/successpayment', async(request, response, next)=>{
	// response.render('layout',
	// {
	// 	template:'successpayment',
	// 	successmessage:"Congratulations! Your payment was a success!",
	// });
  // });

  // router.post("/create-payment-intent", async (request, response,next) => {
  //   const { items } = request.body;

  //   // Create a PaymentIntent with the order amount and currency
  //   const paymentIntent = await stripe.paymentIntents.create({
  //     amount: calculateOrderAmount(items),
  //     currency: "usd",
  //     // In the latest version of the API, specifying the `automatic_payment_methods` 
  //     // parameter is optional because Stripe enables its functionality by default.
  //     automatic_payment_methods: {
  //       enabled: true,
  //     },
  //   });

  //   response.send({
  //     clientSecret: paymentIntent.client_secret,
  //   });
  // });


module.exports = router
