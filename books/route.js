const express = require('express');
const router = express.Router();

require('dotenv').config();
const csrf = require('csurf');

const {viewBooks,allBooks} = require('./controller');

module.exports = () => {
  
  

    router.get("/",viewBooks)
    router.get("/api", allBooks)
    //send this to the api section
    /*
    router.get("/allBooks",allBooks)
    */
  
  
    return router ;
}