const express = require('express');
const router = express.Router();
var path = require('path');

require('dotenv').config();


const {
    booksHtmlView,
    allBooksDumpApi,
    oneBookDetailsHtmlView,
    addBookWithISBN,
    getAddBookWithISBNForm, 
    searchBook,
    deleteBook,
    getUpdateBookForm,
    saveUpdateBookFormData
} = require('./controller');

const { verifyLogin } = require('../admin/middleware') ;
const verifyAdminIsLoggedIn = verifyLogin;
const {
    validateISBN,
    validateCreateNewBookForm, 
    validateBookID,
    validateBookUpdateForm,
    validateAddBookWithISBNForm
} = require('./middleware');
const { showError404 } = require('../controllers/indexController');
module.exports = () => {
  
    router.get("/",booksHtmlView);
    router.get(`/addBookWithExternalAPI`,verifyAdminIsLoggedIn,  getAddBookWithISBNForm);
    router.post(`/addBookWithExternalAPI`,verifyAdminIsLoggedIn,validateAddBookWithISBNForm,addBookWithISBN);  

    router.get(`/delete/:id`,verifyAdminIsLoggedIn,validateBookID, deleteBook);    
    router.post('/search', searchBook)    

    
    router.get(`/update/:id`,verifyAdminIsLoggedIn,validateBookID, getUpdateBookForm);    
    router.post('/update', verifyAdminIsLoggedIn, validateBookUpdateForm, saveUpdateBookFormData)    
    //send this to the api section
    router.get(`/api`, allBooksDumpApi)

    router.get("/:seo_friendly_title",oneBookDetailsHtmlView)
    router.get("/*",showError404)
    router.post("/*",showError404)
   
    return router ;
}