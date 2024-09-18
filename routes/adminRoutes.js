
//import

const csrf = require('csurf');
let csrfProtection = csrf({ cookie: true });
const express = require('express');
const router = express.Router();
const {login,formSubmit,verifyOTP,dashboard,GetOrders,adminProfile,processAccountChanges,logout} = require("../controllers/adminController")

//middleware
const validateOTP=require("../middleware/OTPmiddleware")
const verifyLogin=require("../middleware/verifyLogin")
const updateAdminInformation=require("../middleware/updateAdminInformation")




//routes
router.get("/",login)
router.post("/",formSubmit)
router.post("/verifyOtp",validateOTP,verifyOTP)
router.get("/dashboard",verifyLogin,dashboard)
router.get("/GetOrders",verifyLogin,GetOrders)


// router.get("/dashboard",dashboard)
router.get("/adminProfile",verifyLogin,adminProfile)
router.post("/adminProfile",verifyLogin,updateAdminInformation,processAccountChanges)
// router.get("/GetOrders",GetOrders)

router.get("/logout",logout)

//routes end    



module.exports=router
