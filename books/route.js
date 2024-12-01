const express = require('express');
const router = express.Router();
var path = require('path');

require('dotenv').config();
const csrf = require('csurf');

const {deleteBook,GetinsertBook,CreateBook,updateBook,saveUpdate,addBookWithISBN,getaddBookWithISBNForm} = require("../controllers/BooksController")

const {booksHtmlView,allBooksDumpApi,oneBookDetailsHtmlView} = require('./controller');
const {booksApiRouteName} = require('./utilities') ;
module.exports = () => {
  
    

    router.get("/",booksHtmlView)
    
    router.get(`/${booksApiRouteName()}`, allBooksDumpApi)
    
    router.get("/:seo_friendly_title",oneBookDetailsHtmlView)
    //send this to the api section
    /*
    router.get("/allBooks",allBooks)
    */
  
  
    return router ;
}