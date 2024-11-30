const express = require('express');
const router = express.Router();

require('dotenv').config();
const csrf = require('csurf');

const {booksHtmlView,allBooksDumpApi,oneBookDetailsHtmlView} = require('./controller');
const {booksApiRouteName} = require('./utilities') ;
module.exports = () => {
  
  

    router.get("/",booksHtmlView)
    
    router.get(`/${booksApiRouteName()}`, allBooksDumpApi)
    
    router.get("/:bookID",oneBookDetailsHtmlView)
    //send this to the api section
    /*
    router.get("/allBooks",allBooks)
    */
  
  
    return router ;
}