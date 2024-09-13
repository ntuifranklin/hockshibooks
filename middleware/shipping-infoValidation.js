const { body, validationResult } = require('express-validator');

const validateShippingInfo = [
  body('shippingInfo.address').notEmpty().withMessage('Address is required'),
  body('shippingInfo.city').notEmpty().withMessage('City is required'),
  body('shippingInfo.state').notEmpty().withMessage('State is required'),
  body('shippingInfo.country').notEmpty().withMessage('Country is required'),
  body('shippingInfo.postalCode').notEmpty().withMessage('Postal Code is required')
    .isPostalCode('any').withMessage('Invalid Postal Code'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = validateShippingInfo;
