const express = require('express');
const router = express.Router();

require('dotenv').config();
const csrf = require('csurf');

//admin module
const adminRoute = require('../admin/route');

//books module
const booksRoute = require('../books/route');

//cart module
const cartRoute = require('../cart/route');

//docs module
const docsRoute = require('../agreementdocs/route');

//checkout route 
const checkoutRoute = require('../checkout/route');

//orders route
const ordersRoute = require('./OrdersRoute');
const {
  showHomePage,
  searchBook,
  loginPage,
  signupPage,
  signupPost,
  loginPagePost,
  checkout,
  successPayment,
  verifyOTP,
  processGuestUser,
  showGuestPage,
  showForm,
  Profile,
  updateProfile,
  orderDetail,
  showError404,
  logout
}= require("../controllers/indexController");
const customerSignupValidation = require('../middleware/customerSignupValidation');
const updateProfileValidation=require("../middleware/updateProfileValidation")

// const {stripe} = require('../utilities/stripe') ;




const calculateOrderAmount = (items) => { 

// Replace this constant with a calculation of the order's amount
// Calculate the order total on the server to prevent

// people from directly manipulating the amount on the client
return 50;                                                                

};

exports.calculateOrderAmount = calculateOrderAmount ;

module.exports = () => {
  router.get("/",showHomePage)

  router.use('/admin',adminRoute())
  router.use('/books',booksRoute())
  router.use('/cart', cartRoute())
  router.use('/docs', docsRoute())
  

  router.use( '/checkout',checkoutRoute())
  /*
    router.get("/success",successPayment)
  */

    router.use('/order',ordersRoute());


  
  
  /* 
   router.get("/productDetails/:id",bookDetail)
  */

  /* Moved to books/search 
  router.post("/search",searchBook)
  */

  router.route("/login").get(loginPage).post(loginPagePost)


  router.get("/askGuest",showGuestPage)

  router.route("/showForm").get(showForm).post(processGuestUser)




  router.post("/verifyOTP",verifyOTP)

  router.get("/signup",signupPage)

  router.post("/signup",customerSignupValidation,signupPost)

  router.get("/logout",logout)

  router.get("/profile",Profile)

  router.post("/updateProfile",updateProfileValidation,updateProfile)

  //router.get("/orderDetail/:id",orderDetail)
  router.get("/f404",showError404)
  router.get("/*", showError404)
  router.post("/*", showError404)




  return router ;
}
