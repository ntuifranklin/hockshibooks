

const { check,validationResult } = require('express-validator');


const { adminRouteName, isAdminUserIsLoggedInAndSavedInCache } = require('./utilities');
const { retrieveJSONObjectFromRedisCache, userRequestToKey, readDataFromRedisCache } = require('../middleware/redis');
const { USER, LOGGED_IN_USER_VARIABLE_NAME } = require('../utilities/universal_web_constants');
require("dotenv").config()  
const validateOTP = [
      // Check that 'userId' is an integer

    check('userId').isUUID().withMessage('User ID must be an integer'),
        // Check that 'OTP' is exactly 6 digits long

    check('OTP').isLength({ min: 6, max: 6 }).withMessage('OTP code must be 6 digits long'),
    (req, res, next) => {
      
        // Proceed to the next middleware or route handler

      next();
    },
  ]; 

/**
 * Middleware to verify if a user is logged in.
 *
 * This middleware checks if the `user` object is present in the session. If the user is not logged in (i.e., `req.session.user` is `undefined`), it renders a "not allowed" page. If the user is logged in, it allows the request to proceed to the next middleware or route handler.
 *

 */
const verifyLogin= async(req,res,next)=>{
    let userKey = "USER";
    let user = await retrieveJSONObjectFromRedisCache(userKey);
    if (user) {
        req.session.user = user;
        return next();
    } else {
        return res.status(403).redirect(`/admin`);
    }
} ;

const redirectToAdminDashboardIfLoggedIn= (req,res,next)=>{
    if (isAdminUserIsLoggedInAndSavedInCache()){
        return res.status(200).redirect(`/admin/dashboard`);
    };
    next();

};

module.exports={
    verifyLogin,
    validateOTP,
    redirectToAdminDashboardIfLoggedIn
}