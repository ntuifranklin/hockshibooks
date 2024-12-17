
const { body,check,validationResult } = require('express-validator');

const customerModel=require("../models/customerModel")
const {showCustomerProfile} = require('./controller');
const validateCustomerSignupForm = [
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
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    const err = errors.array()
                    req.body.errors=err
                  return showCustomerProfile(req, res);
                }
                next();
            }
    ];
    

const validateCustomerOTP = [
      // Check that 'userId' is an integer

    //check('customer_id').isUUID().withMessage('User ID must be a UUID'),
        // Check that 'OTP' is exactly 6 digits long

    check('OTP').isLength({ min: 6, max: 6 }).withMessage('OTP code must be 6 digits long'),
    (req, res, next) => {
        let customer ;
        customer = customerModel.findOne({
            where:{
            customer_id:req.body.customer_id
            }
        });
        if (!customer) {
            return res.status(404).redirect('/customer/login?msg=Customer+not+found');
        }
        if(!validationResult(req).isEmpty()){
            let errMess = '';
            validationResult(req).errors.forEach((error)=>{
                errMess += error.msg + '\n';
            });
            return res.status(400).redirect('/customer/verifyOTP?msg='+errMess);
        }

        // Proceed to the next middleware or route handler

      next();
    },
    
]; 

const validateProfileUpdate = [
    // First Name: Required, must be at least 2 characters long
    check('first_name')
        .notEmpty().withMessage('First Name is required')
        .isLength({ min: 2 }).withMessage('First Name must be at least 2 characters long'),

    // Last Name: Required, must be at least 2 characters long
    check('last_name')
        .notEmpty().withMessage('Last Name is required')
        .isLength({ min: 2 }).withMessage('Last Name must be at least 2 characters long'),

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
    
   
    (req, res, next) => {
        //const errors = validationResult(req);
        if(!validationResult(req).isEmpty()){
            let errMess = '';
            validationResult(req).errors.forEach((error)=>{
                errMess += error.msg + '\n';
            });
            return res.status(400).redirect('/customer/profile?msg='+errMess);
        }
        next();
    },
    
    
];

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
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
  ];
  
const verifyCustomerIsLoggedIn=async (req,res,next)=>{
    /**
 * Verifies if a user is logged in and redirects them to the guest page if not.
 *
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {function} next - The next middleware function in the stack.
 * @return {void}
 */
    if (res.locals.customer || req.session.customer) { // or any other authentication check
        return next();
    } else {
        return res.redirect('/customer/login');
    }

}


module.exports = {
    validateCustomerSignupForm,
    validateCustomerOTP,
    validateProfileUpdate,
    verifyGuestEmail,
    verifyCustomerIsLoggedIn
}