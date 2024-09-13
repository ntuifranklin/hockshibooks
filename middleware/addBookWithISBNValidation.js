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
      })
  ];

  module.exports=validateISBN