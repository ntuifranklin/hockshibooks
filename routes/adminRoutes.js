
//import

const csrf = require('csurf');
let csrfProtection = csrf({ cookie: true });
const express = require('express');
const router = express.Router();
const {login,formSubmit,verifyOTP,dashboard,logout} = require("../controllers/adminController")

//middleware
const validateOTP=require("../middleware/OTPmiddleware")
const verifyLogin=require("../middleware/verifyLogin")


//routes
router.get("/",login)
router.post("/",formSubmit)
router.post("/verifyOtp",validateOTP,verifyOTP)
router.get("/dashboard",verifyLogin,dashboard)
router.get("/logout",logout)

//routes end    



module.exports=router
