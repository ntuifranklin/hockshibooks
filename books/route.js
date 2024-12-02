const express = require('express');
const router = express.Router();
var path = require('path');

require('dotenv').config();
const csrf = require('csurf');

const {booksHtmlView,allBooksDumpApi,oneBookDetailsHtmlView,addBookWithISBN,getAddBookWithISBNForm} = require('./controller');
const {booksApiRouteName, addBooksWithISBNOnlyRouteName} = require('./utilities') ;
const { verifyLogin } = require('../admin/middleware') ;
const validateISBN = require('./middleware');
module.exports = () => {
  
    router.get("/",booksHtmlView)
    router.get(`/${addBooksWithISBNOnlyRouteName()}`,verifyLogin,  getAddBookWithISBNForm)
    router.post(`/${addBooksWithISBNOnlyRouteName()}`,verifyLogin,validateISBN, addBookWithISBN);
        
    router.get("/:seo_friendly_title",oneBookDetailsHtmlView)
    router.get(`/${booksApiRouteName()}`, allBooksDumpApi)
    //send this to the api section
    /*
    router.get("/allBooks",allBooks)
    */
  
  
    return router ;
}