const { body, validationResult } = require('express-validator');

const BookModel=require("../models/bookModel")

const validateISBN = [
    body('isbn')
      .custom(value => {
        const length = value.length;
        if (length !== 10 && length !== 13) {
          throw new Error('ISBN must be either 10 or 13 characters long');
        }
      
        return true;
    }),
    (req, res, next) => { 
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    }
        
];







// Middleware to validate form inputs
const validateBookForm = [
  // Title is required and should be at least 1 character long
  body('title')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Title is required'),

  // Author is required and should be at least 1 character long
  body('author')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Author is required'),

  // ISBN should be a valid string and required
  body('ISBN')
  .matches(/^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/)
  .withMessage('Invalid ISBN format')
  .custom(async(ISBN)=>{
    const existingISBN= await bookModel.findOne({where:{ISBN:ISBN}})

    if(existingISBN){
      throw new Error('ISBN already exists')
    }
  }),

  // Price should be a decimal number and required
  body('price')
    .isDecimal()
    .withMessage('Price must be a decimal number'),

  // Quantity should be an integer and required
  body('quantity')
    .isInt()
    .withMessage('Quantity must be an integer'),

  // Language should be at least 1 character long
  body('language')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Language is required'),

    body('location')
    .trim()
    .isLength({ min: 1 })
    .withMessage('please enter a location'),

    body('date')
    .isDate()
    .withMessage('select the release date'),
    
  // Optional: Validate other fields like description, cover image URL, etc.
  body('description')
    .optional()
    .trim()
    .isLength({ max: 5000 })
    .withMessage('Description is too long'),

  // Middleware to check for validation errors
  (req, res, next) => {
    
    next();
  },
];

module.exports= {
  validateISBN,
  validateBookForm,
  
}