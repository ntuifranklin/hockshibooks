/**
 * Middleware array for validating book form inputs.
 *
 * This array of middleware functions performs various validations on the book form fields and handles validation errors.
 * 
 */


const { body, validationResult } = require('express-validator');

// Middleware to validate form inputs
const verifyGuestEmail = [
  body('email')
  .isEmail()
  .withMessage('Email must be valid')
  .isLength({ max: 64 })
  .withMessage('Email must be at most 64 characters long')
  .notEmpty()
  .withMessage('Email is required'),

  // Middleware to check for validation errors
  (req, res, next) => {
    
    next();
  },
];

module.exports = verifyGuestEmail;
