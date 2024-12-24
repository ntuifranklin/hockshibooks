
const express = require('express');

const router = express.Router();
const {
    policyPage, 
    termsAndConditionPage, 
    faqPage
} = require('./controller');
module.exports = () => { 
           
    router.get("/policy", policyPage) ;
    router.get("/terms-and-conditions", termsAndConditionPage) ;
    router.get("/faq", faqPage) ;

    return router  ;
}