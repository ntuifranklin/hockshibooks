const express = require('express');
const router = express.Router();
const {changeToDelivered,changeToProcessing,changeToShipped,viewOrder, orderDetail}=require("./controller")

const {verifyLogin} = require('../admin/middleware');
const verifyAdminUserIsLoggedIn =  verifyLogin; 
const {verifyCustomerIsLoggedIn} = require("../customer/middleware");
const {customerIsLoggedInOrAdminUserIsLoggedIn,requestHasOrderIDParameter} = require("./middleware");

module.exports = () => {
    
router.get("/viewOrder/:id",requestHasOrderIDParameter,customerIsLoggedInOrAdminUserIsLoggedIn,viewOrder)
router.get("/changeToProcessing/:id",requestHasOrderIDParameter,verifyAdminUserIsLoggedIn,changeToProcessing)
router.get("/changeToShipped/:id",requestHasOrderIDParameter,verifyAdminUserIsLoggedIn,changeToShipped)
router.get("/changeToDelivered/:id",requestHasOrderIDParameter,verifyAdminUserIsLoggedIn,changeToDelivered)
router.get("/orderDetail/:id",requestHasOrderIDParameter,customerIsLoggedInOrAdminUserIsLoggedIn,orderDetail)

return router ;

}
