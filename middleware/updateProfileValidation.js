const { check, validationResult } = require('express-validator');

const validateProfileUpdate = [
    // First Name: Required, must be at least 2 characters long
    check('first_name')
        .notEmpty().withMessage('First Name is required')
        .isLength({ min: 2 }).withMessage('First Name must be at least 2 characters long'),

    // Last Name: Required, must be at least 2 characters long
    check('last_name')
        .notEmpty().withMessage('Last Name is required')
        .isLength({ min: 2 }).withMessage('Last Name must be at least 2 characters long'),

    // Email Address: Required, must be a valid email format
    check('email')
        .notEmpty().withMessage('Email Address is required')
        .isEmail().withMessage('Please enter a valid email address'),

    // Phone Number: Required, must be a valid phone number (example for Cameroon)
    check('phone')
        .notEmpty().withMessage('Phone Number is required')
        .matches(/^[0-9\-\+]{9,15}$/).withMessage('Please enter a valid phone number'),

    // State/Province: Required, can be any string
    check('state_province')
        .notEmpty().withMessage('State/Province is required'),

    // Street Address: Required
    check('street_address')
        .notEmpty().withMessage('Street Address is required'),

    // City: Required
    check('city')
        .notEmpty().withMessage('City is required'),

    // Zip Code: Optional, but if present, must be exactly 5 digits
    check('postal_zipcode')
        .optional()
        .isLength({ min: 5, max: 5 }).withMessage('Zip Code must be exactly 5 digits'),

    // Old Password: Optional, but if present, must be at least 6 characters long
    check('oldPassword')
        .optional({ checkFalsy: true })
        .isLength({ min: 6 }).withMessage('Old Password must be at least 6 characters long'),

    // New Password: Optional, but if present, must be at least 6 characters long and match confirmation
    check('newPassword')
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
