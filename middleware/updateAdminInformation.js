const { check, validationResult } = require('express-validator');

const validateProfileUpdate = [
    // First Name: Required, must be at least 2 characters long
  

    // Email Address: Required, must be a valid email format
    check('email')
        .notEmpty().withMessage('Email Address is required')
        .isEmail().withMessage('Please enter a valid email address'),

  


    // Old Password: Optional, but if present, must be at least 6 characters long
    check('Old_password')
        .notEmpty().withMessage("please enter your current password")
        .isLength({ min: 6 }).withMessage('Old Password must be at least 6 characters long'),

    // New Password: Optional, but if present, must be at least 6 characters long and match confirmation
    check('New_password')
        .optional({ checkFalsy: true })
        .isLength({ min: 6 }).withMessage('New Password must be at least 6 characters long'),
    
    // Confirm Password: Required if newPassword is present, must match newPassword
    // check('confirmPassword')
    //     .custom((value, { req }) => {
    //         if (req.body.newPassword && value !== req.body.newPassword) {
    //             throw new Error('Passwords do not match');
    //         }
    //         return true;
    //     })

    (req, res, next) => {
        const errors = validationResult(req);
        
        next();
    },
];

// Middleware to handle validation errors

module.exports =  validateProfileUpdate
