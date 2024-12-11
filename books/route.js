const express = require('express');
const router = express.Router();
var path = require('path');

require('dotenv').config();
const csrf = require('csurf');

const {booksHtmlView,allBooksDumpApi,oneBookDetailsHtmlView,addBookWithISBN,getAddBookWithISBNForm, searchBook,deleteBook} = require('./controller');
const {booksApiRouteName, addBooksWithISBNOnlyRouteName} = require('./utilities') ;
const { verifyLogin } = require('../admin/middleware') ;
const validateISBN = require('./middleware');
const { showError404 } = require('../controllers/indexController');
module.exports = () => {
  
    router.get("/",booksHtmlView);
    router.get(`/addBookWithExternalAPI`,verifyLogin,  getAddBookWithISBNForm);
    router.post(`/addBookWithExternalAPI`,verifyLogin,validateISBN, addBookWithISBN);  

    router.get(`/delete/:id`,verifyLogin,validateISBN, deleteBook);    
    router.post('/search', searchBook)    
    //send this to the api section
    router.get(`/api`, allBooksDumpApi)

    router.get("/:seo_friendly_title",oneBookDetailsHtmlView)
    router.get("/*",showError404)
    router.post("/*",showError404)
   
    return router ;
}