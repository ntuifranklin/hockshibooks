const express = require('express');
const router = express.Router();
const {login,formSubmit,verifyOTP,dashboard} = require("../controllers/adminController")
const {deleteBook,GetinsertBook,CreateBook,updateBook,saveUpdate} = require("../controllers/BooksController")
const {checkFileExtension}=require("../utilities/functions");
const path = require('path');
const multer=require("multer")
const csrf = require('csurf');
let csrfProtection = csrf({ cookie: true });

//middlewares
const verifyLogin=require("../middleware/verifyLogin")
const validatForm=require("../middleware/verifyBookForm")
const bookUpdateMiddleware=require("../middleware/bookUpdateMiddleware")

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
 


//Books CRUD
router.get("/insert-book",verifyLogin,GetinsertBook)
router.post("/insert-book",verifyLogin,upload.single("coverImage"),validatForm,CreateBook)

router.get("/update/:id",verifyLogin,updateBook)
router.post("/update/",verifyLogin,upload.single("coverImage"),bookUpdateMiddleware,saveUpdate)


router.get("/delete/:id",verifyLogin,deleteBook)


module.exports=router 