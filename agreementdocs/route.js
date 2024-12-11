
const express = require('express');

const router = express.Router();
const {policyPage, termsAndConditionPage} = require('./controller');
module.exports = () => { 
           
    router.get("/policy", policyPage) ;
    router.get("/terms-and-conditions", termsAndConditionPage) ;

    return router  ;
}