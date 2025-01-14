const express = require('express');
const {errorsController} = require('./controller');
const router = express.Router();


module.exports = () => {
    
    // Route to handle error page
    router.get('/', errorsController);
    router.get('/500', errorsController);

    return router;
};