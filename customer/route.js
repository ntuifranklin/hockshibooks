const express = require('express');
const router = express.Router();

const {
    customerLoginPage,
    customerLoginPagePost,
    showGuestPage,
    showForm,
    processGuestUser,
    verifyCustomerOTP,
    signupPage,
    customerSignupPost,
    logout,
    Profile,
    updateProfile

} = require('./controller');

const {
    validateProfileUpdate,
    validateCustomerSignupForm,
    validateCustomerOTP,
    verifyCustomerIsLoggedIn

} = require('./middleware');
require('dotenv').config();


module.exports = () => {
   

        router.route("/login").get(customerLoginPage).post(customerLoginPagePost)


        router.get("/askGuest",showGuestPage)
  
        router.route("/showForm").get(showForm).post(processGuestUser)
  
  
  
  
        router.post("/verifyOTP",validateCustomerOTP,verifyCustomerOTP)
  
        router.get("/signup",signupPage)
  
        router.post("/signup",validateCustomerSignupForm,customerSignupPost)
  
        router.get("/logout",logout)
  
        router.get("/profile",verifyCustomerIsLoggedIn,Profile)
  
        router.post("/updateProfile",validateProfileUpdate,updateProfile)


        return router ;



}