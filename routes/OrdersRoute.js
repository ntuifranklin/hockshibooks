const express = require('express');
const router = express.Router();
const {changeToDelivered,changeToProcessing,changeToShipped,viewOrder}=require("../controllers/OrdersController")

const verifyLogin=require("../middleware/verifyLogin")

router.get("/viewOrder/:id",verifyLogin,viewOrder)
router.get("/changeToProcessing/:id",verifyLogin,changeToProcessing)
router.get("/changeToShipped/:id",verifyLogin,changeToShipped)
router.get("/chnageToDelivered/:id",verifyLogin,changeToDelivered)

// router.get("/viewOrder/:id",viewOrder)
// router.get("/changeToProcessing/:id",changeToProcessing)
// router.get("/changeToShipped/:id",changeToShipped)
// router.get("/chnageToDelivered/:id",changeToDelivered)

module.exports = router 