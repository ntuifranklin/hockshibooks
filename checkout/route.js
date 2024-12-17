require('dotenv').config(); 

const express = require('express');
const router = express.Router();

const csrf = require('csurf');
const {showStripePublicKey,checkout,askShippingInfo,successPayment} = require('./controller');
const shippingInfoValidation = require('./middleware');   
module.exports = () => {
    
    router.get('/',askShippingInfo)
    router.post('/',shippingInfoValidation,checkout)
    router.get('/stripe_public_key', showStripePublicKey);
    router.get("/successPayment",successPayment)
    return router;

};