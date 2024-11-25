const express = require('express');
const router = express.Router();

require('dotenv').config();
const csrf = require('csurf');
let csrfProtection = csrf({ cookie: true });
const allAdminRoutes = require('./adminRoutes');
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
  processGuestUser,
  showGuestPage,
  showForm,
  allBooks,
  Profile,
  viewBooks,
  updateProfile,
  oderDetail,
  showError404,
  logout
}= require("../controllers/indexController");
const customerSignupValidation = require('../middleware/customerSignupValidation');
const verifyUser= require("../middleware/verifyUser")
const shippingInfoValidation=require("../middleware/shipping-infoValidation")
const updateProfileValidation=require("../middleware/updateProfileValidation")

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

router.route("/cart").get(viewCart).post(getCartItems)


router.route("/login").get(loginPage).post(loginPagePost)


router.get("/askGuest",showGuestPage)

router.route("/showForm").get(showForm).post(processGuestUser)


router.post("/search",searchBook)


router.post("/verifyOTP",verifyOTP)

router.get("/signup",signupPage)

router.post("/signup",customerSignupValidation,signupPost)

router.post( '/checkout',verifyUser,shippingInfoValidation,checkout)

router.get("/books",viewBooks)

  router.get("/allBooks",allBooks)


router.get("/success",successPayment)

router.get("/logout",logout)

router.get("/profile",Profile)

router.post("/updateProfile",updateProfileValidation,updateProfile)

router.get("/orderDetail/:id",oderDetail)

router.use('/admin',allAdminRoutes());

router.get("*",showError404)

router.post("*",showError404)



module.exports = router
