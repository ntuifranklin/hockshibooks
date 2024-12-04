const express = require('express');
const { updateCartInRedisSessionCache, viewCart, getCartItems } = require('./controller');
const { showError404 } = require('../controllers/indexController');
const router = express.Router();


module.exports = () => {

   
    router.get("/view", viewCart) ;
    router.get("/items", getCartItems) ;
    router.post("/update",updateCartInRedisSessionCache)
    

    
    return router  ;
}