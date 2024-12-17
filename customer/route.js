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
    customerLogout,
    showCustomerProfile,
    updateCustomerProfile

} = require('./controller');

const {
    validateProfileUpdate,
    validateCustomerSignupForm,
    validateCustomerOTP,
    verifyCustomerIsLoggedIn

} = require('./middleware');
require('dotenv').config();


module.exports = () => {
   

        router.get("/login", customerLoginPage); 
        router.post("/login", customerLoginPagePost) ;
  
        router.post("/verifyOTP",validateCustomerOTP,verifyCustomerOTP) ;
        router.get("/profile",verifyCustomerIsLoggedIn,showCustomerProfile);
        
        router.post("/profile",verifyCustomerIsLoggedIn,validateProfileUpdate,updateCustomerProfile);

        router.get("/askGuest",showGuestPage);
  
        router.route("/showForm").get(showForm).post(processGuestUser);
  
        router.get("/signup",signupPage);
  
        router.post("/signup",validateCustomerSignupForm,customerSignupPost);
  
        router.get("/logout",customerLogout);
  
  


        return router ;



}