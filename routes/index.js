const express = require('express');
const router = express.Router();

require('dotenv').config();


module.exports = () => { 
        
    router.get('/', async (request, response) => { 
        
        //console.log(`User cart : ${JSON.stringify(userCart)}`);
        response.status(200).send(`What's up woman/man ?`);
        return ;
        
    });
    
   
    
    return router;
};
