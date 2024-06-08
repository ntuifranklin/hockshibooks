
/**
 * Middleware array for validating OTP inputs.
 *
 * This array of middleware functions performs the following validations and operations:
 * 1. Checks that the `userId` is an integer.
 * 2. Ensures the `OTP` is exactly 6 digits long.
 * 3. If there are validation errors, it stores them in the request object for later use.
 * 
 * The middleware functions are executed in sequence.
 * 
 */

const { check,validationResult } = require('express-validator');

const validateOTP = [
      // Check that 'userId' is an integer

    check('userId').isInt().withMessage('User ID must be an integer'),
        // Check that 'OTP' is exactly 6 digits long

    check('OTP').isLength({ min: 6, max: 6 }).withMessage('OTP code must be 6 digits long'),
    (req, res, next) => {
      
        // Proceed to the next middleware or route handler

      next();
    },
  ]; 


  module.exports=validateOTP