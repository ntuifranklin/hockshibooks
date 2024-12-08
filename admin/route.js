
//import

const csrf = require('csurf');
let csrfProtection = csrf({ cookie: true });
const express = require('express');
const router = express.Router();
const {login,formSubmit,verifyOTP,dashboard,logout} = require("./controller")

const {redirectToAdminDashboardIfLoggedIn} = require('./utilities');


//middleware
const {validateOTP,verifyLogin}=require("./middleware")


const multer=require("multer") ;
const { addBooksWithISBNOnlyRouteName } = require('../books/utilities');
const { showError404 } = require('../controllers/indexController');
const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"./views/uploads")
    },
    filename:(req,file,cb)=>{
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload=multer({storage:storage ,
    
}) 
 
module.exports = () => {
    //routes
    router.get("/", login); 
    router.post("/",formSubmit) ;
    router.get("/dashboard",verifyLogin,dashboard) ;
    router.post("/adminProfile",verifyLogin,dashboard) ;
    router.get("/logout",logout) ;
    router.post("/verifyOtp",validateOTP,verifyOTP) ;
    
    

    return router  ;
}
//routes end    

