const express = require('express');
const { updateCartInRedisSessionCache, viewCart } = require('./controller');
const { showError404 } = require('../controllers/indexController');
const router = express.Router();


module.exports = () => {

    router.get("/view", viewCart) ;
    router.post("/update",updateCartInRedisSessionCache)
    

    
    return router  ;
}