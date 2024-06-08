/**
 * Middleware array for validating book form inputs.
 *
 * This array of middleware functions performs various validations on the book form fields and handles validation errors.
 * 
 */
const bookModel=require("../models/bookModel")


const { body, validationResult } = require('express-validator');

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
  .withMessage('Invalid ISBN format'),
  
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

    body('genre')
    .trim()
    .isInt()
    .withMessage('please select a genre'),

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

module.exports = validateBookForm;
