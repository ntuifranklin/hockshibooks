const express = require('express');
const router = express.Router();

require('dotenv').config();

const { check,validationResult } = require('express-validator');
var csrf = require('csurf');
// csrf protection
var csrfProtection = csrf({ cookie: true });
/*

    book_id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(512) NOT NULL,
    author VARCHAR(256) NOT NULL,
    ISBN VARCHAR(32) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    genre VARCHAR(128),
    publication_date DATE,
    language VARCHAR(64),
    cover_image_url VARCHAR(1024)
*/

const checkOutValidation = [
    check('title').isLength({ min: 5, max:512 }).withMessage('Please check the book title'),
    check('author').isLength({min:6, max:256}).withMessage('Please check the author'),
    check('isbn').isLength({ min: 5, max:32 }).withMessage('Please check the ISBN'),
    check('description').isLength({ min: 2, max:655535 }).withMessage('Please check the book description.'),
    check('price').isLength({ min: 1, max:12 }).withMessage('Please check the price.'),
    check('publication_date').isDate().withMessage('Please make sure the date is valid '),
    check('language').isLength({ min: 5, max:64 }).withMessage('Please check the language'),
    check('cover_image_url').isLength({ min: 5, max:1024 }).withMessage('Please check the cover image url'),
];
module.exports = () => { 
        
    router.get("/api/books", async (request, response, next) => { 
       
    });


    router.post("/api/books", checkOutValidation,csrfProtection, async (request, response,next) => {
        

    });

      
  return router;

};

