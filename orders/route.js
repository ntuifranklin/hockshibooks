const express = require('express');
const router = express.Router();
const {changeToDelivered,changeToProcessing,changeToShipped,viewOrderByAdmin, orderDetail}=require("./controller")

const {verifyLogin} = require('../admin/middleware');
const verifyAdminUserIsLoggedIn =  verifyLogin; 
const {verifyCustomerIsLoggedIn} = require("../customer/middleware");
const {requestHasOrderIDParameter} = require("./middleware");

module.exports = () => {
    
router.get("/view/:id",requestHasOrderIDParameter,verifyAdminUserIsLoggedIn,viewOrderByAdmin)
router.get("/changeToProcessing/:id",requestHasOrderIDParameter,verifyAdminUserIsLoggedIn,changeToProcessing)
router.get("/changeToShipped/:id",requestHasOrderIDParameter,verifyAdminUserIsLoggedIn,changeToShipped)
router.get("/changeToDelivered/:id",requestHasOrderIDParameter,verifyAdminUserIsLoggedIn,changeToDelivered)
router.get("/orderDetail/:id",requestHasOrderIDParameter,verifyCustomerIsLoggedIn,orderDetail)

return router ;

}
