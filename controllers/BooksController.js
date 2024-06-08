const csrf = require('csurf');
let csrfProtection = csrf({ cookie: true });

const sequelize = require('../config/database');
const { validationResult } = require('express-validator');
const { json } = require('body-parser');
const {checkFileExtension}=require("../utilities/functions");
const fs=require("fs")
const path=require("path")
const multer=require("multer")

require("dotenv").config()


//models
const powerUSer= require("../models/adminModel")
const otpModel=require("../models/otpModel")
const bookModel=require("../models/bookModel")
const genreModel=require("../models/genreModel")
const inventoryModel=require("../models/inventory");
const { language } = require('googleapis/build/src/apis/language');

//variables
let updateBookId;

const GetinsertBook= async(req,res)=>{

    /**
     * The purpose of this function is to display a form for inserting a new book, pre-populated with a list of genres to choose from.

Here's what it does:

1. It asynchronously fetch all genres from the genreModel.
2. It then renders a view template named "pages/bookInsert" and passes the fetched genres, the host URL from 3. the environment variables, a msg variable set to false, and a formdata variable set to false.

     */
    const genre= await genreModel.findAll()

    res.render("pages/bookInsert",{
        host:process.env.HOST,
        genre:genre,
        msg:false,
        formdata:false,

    })
}

const CreateBook=async (req,res)=>{

    /**
     * The create book is an asynchrounous function which handles handles post requests for the creation of a new book
    */

    //The function first checks for any validation errors using validationResult(req).

        const errors=validationResult(req)
        const error={}
        // If there are validation errors, it retrieves all genres from the database and adds an error message if no file (cover image) is uploaded.
        if(!req.file){

            error.push({
                                
                type: 'field',
                value: '',
                msg: 'Cover Image Is Required',
                path: 'cover_image_url',
                location: 'body'
              
        })
                if(!errors.isEmpty()){
                        const genre= await genreModel.findAll()

                        error={...errors.array()}
                       
                        
                        }
                        
                      
                    res.render("pages/bookInsert",{
                        host:process.env.HOST,
                        genre:genre,
                        msg:error,
                        formdata:req.body,
                    })

                }
                
                else{
                    // If there are no validation errors, it creates a new book using the bookModel, and creates a new inventory using the inventoryModel.
                    let book= await bookModel.create({
                        title:req.body.title,
                        ISBN:req.body.ISBN,
                        genre:req.body.genre,
                        author:req.body.author,
                        description:req.body.description,
                        cover_image_url:req.file.path,
                        language:req.body.language,
                        price:req.body.price,
                        publication_date:req.body.date
                        
                    })
                    inventoryModel.create({
                        book_id:book.book_id,
                        quantity_available:req.body.quantity,
                        location:req.body.location
                    })
            
                    return res.redirect(`${process.env.HOST}/admin/dashboard?msg=item+successfully+added&type=success`);
                }
                // File information is available in req.file
}

const updateBook=async (req,res)=>{ 
    updateBookId=req.params.id?req.params.id:req.body.bookId
    /**
     * Inside the function, it uses the await keyword to asynchronously find a book by its primary key (req.params.id) from the bookModel and includes the associated genreModel and inventoryModel.

It then retrieves all genres from the genreModel using the findAll method.

Finally, it renders a view template named "pages/updateBook" and passes the fetched book, root path from the environment variable process.env.ROOT_PATH, the cover image URL from the book, and the fetched genres as data to the template.
     */
    let error;

    if(req.errors){
        error=req.errors
    }else{
        error=false
    }
    let book= await bookModel.findByPk(updateBookId, {include:[
        {model:genreModel},
        {model:inventoryModel}

]},)
const genre= await genreModel.findAll()
    // res.send(book)
    res.render("pages/updateBook",{
        book:book,
        root_path:process.env.ROOT_PATH,
        image:book.cover_image_url,
        genre:genre,
        msg:error

    })

}

const saveUpdate=async(req,res)=>{
    /**
     * The saveUpdate function handles updating a book and its associated inventory record. It first retrieves the book and inventory records by the book ID, updates the fields with the new data, deletes the old cover image file if a new file is uploaded, and saves the changes to the database. 
     */

    const errors=validationResult(req)

        // If there are validation errors, it retrieves all genres from the database and adds an error message if no file (cover image) is uploaded.

                if(!errors.isEmpty()){
                        const genre= await genreModel.findAll()

                        const error=errors.array()
                        req.errors=error
                        return await updateBook(req,res)
                    
                }else{

                    
    try{
        /**
         * The function retrieves the book and inventory records from the database using the primary key (bookId). If the book or inventory records are not found, it returns a 404 error.
         */
        const book= await bookModel.findByPk(req.body.bookId)
        const inventory=await inventoryModel.findByPk(req.body.bookId)

        if(!book || !inventory){
           return res.status(404).redirect(`${process.env.HOST}/admin/dashboard?msg=item+not+found&type=danger`);
        }
        else{
            //The function updates the fields of the book and inventory records with the data from the request body.
        
            book.set({
        title :req.body.title,
        author : req.body.author,
        language : req.body.language,
        price :req.body.price,
        description :req.body.description,
        publication_date:req.body.date,
        genre:req.body.genre,
            })

            inventory.set({
                quantity_available : req.body.quantity,
                location:req.body.location,
            })
            

        
            if(req.file){
                //If a new file is uploaded, the old cover image file is deleted from the file system, and the new file path is set.
                const coverImagePath = path.join(process.env.ROOT_PATH, book.cover_image_url);
                // Delete the cover image file
                fs.unlink(coverImagePath, async (err) => {
                    if (err) {
                        return res.status(500).redirect(`${process.env.HOST}/admin/dashboard?msg=error+when+deleting+image&type=danger`);;
                    }
                })
        
                book.set({cover_image_url:req.file.path})            
           }
           if(req.body.ISBN != book.ISBN){
            book.set({ISBN:req.body.ISBN})
           }

           //The function saves the updated book and inventory records to the database.

           await book.save()
           await inventory.save()
   
   
                //After successful update, the user is redirected to the dashboard with a success message.

       res.redirect(`${process.env.HOST}/admin/dashboard?msg=item+successfully+updated&type=success`);
       
        
        }
    
}
    
    catch(e){
        return res.status(500).redirect(`${process.env.HOST}/admin/dashboard?msg=server+error&type=danger`);;


    }
}

}


const deleteBook=async (req,res)=>{
    
      /**
 * Deletes a book and its associated cover image from the server and database.
 * 
 * This function performs the following steps:
 * 1. Retrieves the book record from the database by its primary key (ID) provided in the request parameters.
 * 2. Constructs the path to the cover image file associated with the book.
 * 3. Attempts to delete the cover image file from the server's file system.
 * 4. If the image deletion is successful, it deletes the book record from the database.
 * 5. Redirects the user to the admin dashboard with a success message if the deletion is successful.
 * 6. If an error occurs at any step, logs the error and redirects the user to the admin dashboard with an error message.
 * 
     */
    let book= await bookModel.findByPk(req.params.id)
    try{
        const coverImagePath = path.join(process.env.ROOT_PATH, book.cover_image_url);
        // Delete the cover image file
        fs.unlink(coverImagePath, async (err) => {
            if (err) {
                return res.status(500).redirect(`${process.env.HOST}/admin/dashboard?msg=error+when+deleting+image&type=danger`);;

            } 
        })
        
        await book.destroy()
    res.redirect(`${process.env.HOST}/admin/dashboard?msg=item+successfully+deleted&type=success`);
        
    }
    catch(e){
    res.redirect(`${process.env.HOST}/admin/dashboard?msg=error+when+deleting+record&type=danger`);

    }
}

module.exports={
    deleteBook,GetinsertBook,CreateBook,updateBook,saveUpdate
}   