
//import

const csrf = require('csurf');
let csrfProtection = csrf({ cookie: true });
const express = require('express');
const router = express.Router();
const {login,formSubmit,verifyOTP,dashboard,logout} = require("../controllers/adminController")

const {deleteBook,GetinsertBook,CreateBook,updateBook,saveUpdate,addBookWithISBN,getaddBookWithISBNForm} = require("../controllers/BooksController")
const {checkFileExtension}=require("../utilities/functions");

const {changeToDelivered,changeToProcessing,changeToShipped,viewOrder}=require("../controllers/OrdersController")
//middleware
const validateOTP=require("../middleware/OTPmiddleware")
const verifyLogin=require("../middleware/verifyLogin")
const validatForm=require("../middleware/verifyBookForm")
const bookUpdateMiddleware=require("../middleware/bookUpdateMiddleware")
const addBookWithISBNValidation=require("../middleware/addBookWithISBNValidation")

const multer=require("multer") ;
const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"./views/uploads")
    },
    filename:(req,file,cb)=>{
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));

    }
})


const upload=multer({storage:storage ,
    
}) 
 
module.exports = () => {
        
    //routes
    router.get("/",login); 
    router.post("/",formSubmit) ;
    router.post("/verifyOtp",validateOTP,verifyOTP) ;
    router.get("/dashboard",verifyLogin,dashboard) ;
    // router.get("/dashboard",dashboard)

    router.get("/logout",logout) ;
    
    //Books CRUD
    router.get("/insert-book",verifyLogin,GetinsertBook)
    router.post("/insert-book",verifyLogin,upload.single("coverImage"),validatForm,CreateBook)
    router.get("/update/:id",verifyLogin,updateBook)
    router.post("/update/",verifyLogin,upload.single("coverImage"),bookUpdateMiddleware,saveUpdate)
    router.get("/addBookWithISBN",verifyLogin,getaddBookWithISBNForm)
    router.post("/addBookWithISBN",verifyLogin,addBookWithISBNValidation,addBookWithISBN)

    router.get("/delete/:id",verifyLogin,deleteBook)

    //Orders
        
    router.get("/viewOrder/:id",verifyLogin,viewOrder)
    router.get("/changeToProcessing/:id",verifyLogin,changeToProcessing)
    router.get("/changeToShipped/:id",verifyLogin,changeToShipped)
    router.get("/changeToDelivered/:id",verifyLogin,changeToDelivered)

    return router  ;
}
//routes end    

