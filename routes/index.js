const express = require('express');
const router = express.Router();

require('dotenv').config();


//admin module
const adminRoute = require('../admin/route');

//books module
const booksRoute = require('../books/route');

//cart module
const cartRoute = require('../cart/route');

//docs module
const docsRoute = require('../agreementdocs/route');

//checkout route 
const checkoutRoute = require('../checkout/route');

//orders route
const ordersRoute = require('../orders/route');

const customerRoute = require('../customer/route');

const {
  showHomePage,
  showError404,

}= require("../controllers/indexController");

// const {stripe} = require('../utilities/stripe') ;

const newsLetterRoute = require('../newsletter/route');

module.exports = (req,res,next) => {
  try{
    
      router.get("/",showHomePage)

      router.use('/admin',adminRoute())
      router.use('/books',booksRoute())
      router.use('/cart', cartRoute())
      router.use('/docs', docsRoute())
      

      router.use( '/checkout',checkoutRoute())
      /*
        router.get("/success",successPayment)
      */

      router.use('/order',ordersRoute());

      router.use('/customer',customerRoute())

      router.use('/newsletter',newsLetterRoute());     
      
     

      //router.get("/orderDetail/:id",orderDetail)
      router.route("/f404").get(showError404).post(showError404)


      router.route("/*").get(showError404).post(showError404)
      
  } catch (error){
    //send 500 error to the client
    //console.log(`Error in ${__filename}`, error)
    
    router.next(error)
    
  } ;


  return router ;
}
