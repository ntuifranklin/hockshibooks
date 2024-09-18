// validators/customer.js
const { body } = require('express-validator');

const customerSignupValidation = [
        body('first_name')
            .isLength({ max: 64 })
            .withMessage('First name must be at most 64 characters long')
            .notEmpty()
            .withMessage('First name is required'),
        body('last_name')
            .isLength({ max: 64 })
            .withMessage('Last name must be at most 64 characters long')
            .notEmpty()
            .withMessage('Last name is required'),
        body('email')
            .isEmail()
            .withMessage('Email must be valid')
            .isLength({ max: 64 })
            .withMessage('Email must be at most 64 characters long')
            .notEmpty()
            .withMessage('Email is required'),
        body('password')
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters long')
            .notEmpty()
            .withMessage('Password is required'),
        body('street_address')
            .isLength({ max: 256 })
            .withMessage('Street address must be at most 256 characters long')
            .notEmpty()
            .withMessage('Street address is required'),
        body('city')
            .isLength({ max: 128 })
            .withMessage('City must be at most 128 characters long')
            .notEmpty()
            .withMessage('City is required'),
        body('state_province')
            .isLength({ max: 128 })
            .withMessage('State/Province must be at most 128 characters long')
            .notEmpty()
            .withMessage('State/Province is required'),
        // body('country')
        //     .isLength({ max: 128 })
        //     .withMessage('Country must be at most 128 characters long')
        //     .notEmpty()
        //     .withMessage('Country is required'),
        body('postal_zipcode')
            .isLength({ max: 32 })
            .withMessage('Postal/Zip code must be at most 32 characters long')
            .notEmpty()
            .withMessage('Postal/Zip code is required'),
        body('phone')
            .matches(/^[0-9\-\+]{9,15}$/)
            .withMessage('Phone number must be valid and can contain only digits, dashes, and plus signs')
            .notEmpty()
            .withMessage('Phone is required'),

            (req, res, next) => {
                next(); // Pass control to the next middleware or route handler
            }
    ];


module.exports = 
    customerSignupValidation;
