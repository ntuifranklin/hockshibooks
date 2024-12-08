const express = require('express');
const router = express.Router();
const {changeToDelivered,changeToProcessing,changeToShipped,viewOrder}=require("../controllers/OrdersController")

const {verifyLogin} =require("../admin/middleware");
const { orderDetail } = require('../controllers/indexController');

module.exports = () => {
    
router.get("/viewOrder/:id",verifyLogin,viewOrder)
router.get("/changeToProcessing/:id",verifyLogin,changeToProcessing)
router.get("/changeToShipped/:id",verifyLogin,changeToShipped)
router.get("/changeToDelivered/:id",verifyLogin,changeToDelivered)
router.get("/orderDetail/:id",orderDetail)

return router ;

}

