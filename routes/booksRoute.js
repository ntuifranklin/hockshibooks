const express = require('express');
const router = express.Router();
const {login,formSubmit,verifyOTP,dashboard} = require("../controllers/adminController")
const {deleteBook,GetinsertBook,CreateBook,updateBook,saveUpdate,addBookWithISBN,getaddBookWithISBNForm} = require("../controllers/BooksController")
const {checkFileExtension}=require("../utilities/functions");
const path = require('path');
const multer=require("multer")
const csrf = require('csurf');
let csrfProtection = csrf({ cookie: true });

//middlewares
const verifyLogin=require("../middleware/verifyLogin")
const validatForm=require("../middleware/verifyBookForm")
const bookUpdateMiddleware=require("../middleware/bookUpdateMiddleware")
const addBookWithISBNValidation=require("../middleware/addBookWithISBNValidation")

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
router.get("/addBookWithISBN",verifyLogin,getaddBookWithISBNForm)
router.post("/addBookWithISBN",verifyLogin,addBookWithISBNValidation,addBookWithISBN)


router.get("/delete/:id",verifyLogin,deleteBook)

// router.get("/insert-book",GetinsertBook)
// router.post("/insert-book",upload.single("coverImage"),validatForm,CreateBook)

// router.get("/update/:id",updateBook)
// router.post("/update/",upload.single("coverImage"),bookUpdateMiddleware,saveUpdate)

// router.get("/addBookWithISBN",getaddBookWithISBNForm)
// router.post("/addBookWithISBN",addBookWithISBNValidation,addBookWithISBN)
// router.get("/delete/:id",deleteBook)



module.exports=router 