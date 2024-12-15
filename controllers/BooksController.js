require("dotenv").config()
const csrf = require('csurf');
let csrfProtection = csrf({ cookie: true });
const sequelize = require('../config/database');
const { validationResult } = require('express-validator');
const { json } = require('body-parser');
const {checkFileExtension,getBookDescription}=require("../utilities/functions");
const axios = require('axios');
const fs=require("fs")
const path=require("path")
const multer=require("multer")


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
                        msg:error,
                        formdata:req.body,
                    })

                }
                
                else{
                    // If there are no validation errors, it creates a new book using the bookModel, and creates a new inventory using the inventoryModel.
                    let book= await bookModel.create({
                        title:req.body.title,
                        ISBN:req.body.ISBN,
                        author:req.body.author,
                        description:req.body.description,
                        cover_image_url:req.file.path.split("/")[2],
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
           return res.status(404).redirect(`/admin/dashboard?msg=item+not+found&type=danger`);
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
        
                book.set({cover_image_url:req.file.path.split("/")[2]})            
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
        return res.status(500).redirect(`${process.env.HOST}/admin/dashboard?msg=server+error&type=danger`);


    }
}

}


const getaddBookWithISBNForm=(req,res)=>{
    /**
 * Renders the "pages/addBookWithISBNForm" template with a message set to false.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @return {Promise<void>} A promise that resolves when the template is rendered.
 */
    res.status(200).render("pages/admin/addBookWithISBNForm",{
        msg:false,
    })
}

const {generateSeoFriendlyTitle} = require('../books/utilities');
const addBookWithISBN= async(req,res)=>{
    /**
 * Adds a book to the database using its ISBN number.
 * 
 * This function performs the following steps:
 * 1. Retrieves the ISBN number from the request body.
 * 2. Validates the request body for any errors.
 * 3. If there are errors, renders the "pages/addBookWithISBNForm" template with the error message.
 * 4. If there are no errors, fetches the book data from the Open Library API using the ISBN number.
 * 5. If the book data is found, creates a new book record in the database and adds it to the inventory.
 * 6. If the book record is created successfully, redirects the user to the admin dashboard with a success message.
 * 7. If any error occurs during the process, redirects the user to the admin dashboard with an error message.
 *
 * @param {Object} req - The request object containing the ISBN number and other book details.
 * @param {Object} res - The response object used to render templates or redirect the user.
 * @return {Promise<void>} A promise that resolves when the function is completed.
 */
    const isbn=req.body.isbn
    const price=req.body.price || 25
    const qty=10;
    const errors=validationResult(req)

    
    if(!errors.isEmpty()){
        const err=errors.array()[0]
        res.render("pages/admin/addBookWithISBNForm",{
            msg:err,
        })

    }
    else{
        
        const url = `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&jscmd=data&format=json`;
        try{
            const response= await axios.get(url)

           // console.log(`${JSON.stringify(response.data, null,2)}`);

            const data= response.data[`ISBN:${isbn}`] 

            if(data){
               let desc= await getBookDescription(data.identifiers.openlibrary[0])
                try {
                    const tmp=await bookModel.findOne({
                        where:{
                            title:data.title
                        }
                    })
                    /* ISBN coul return a valid 13 o a valid 10 isbn numbers */
                    var isbn10_or_13 = isbn;
                    if (typeof data.identifiers.isbn_13 != "undefined")
                        isbn10_or_13 = data.identifiers.isbn_13[0];
                    else if (typeof data.identifiers.isbn_10 != "undefined")
                        isbn10_or_13 = data.identifiers.isbn_10[0];
                    
                        
                    var cover_image_url = "";
                    if (typeof data.cover != "undefined" && typeof data.cover.medium != "undefined")
                        cover_image_url = data.cover.medium;
                    const seo_friendly_title = generateSeoFriendlyTitle(
                        bookTitle=data.title, 
                        authorName=data.authors[0].name,
                        publicationYear=data.publication_date
                    );
                    if(!tmp){
                        let createdBook=await bookModel.create({
                        seo_friendly_title:seo_friendly_title,
                        title:data.title,
                        author:data.authors[0].name,
                        ISBN:isbn10_or_13,
                        description: desc,
                        publication_date:data.publication_date,
                        cover_image_url:cover_image_url,
                        price:price
                    })
    
                    let inventory = await inventoryModel.create({
                        book_id:createdBook.book_id ,
                        quantity_available:qty,
                        location:"warehouse"
                    })

                    return res.status(302).redirect(`${process.env.HOST}/admin/dashboard?msg=${createdBook.title}+was+successfully+added&type=success`);
                }
                else{

                    res.status(500).render("pages/admin/addBookWithISBNForm",{
                        msg:{
                            msg:"a book with this title already exists"
                        },
                    })
                }
                } catch (error) {
                    console.log(`${error.message}`);
                    return res.status(500).redirect(`${process.env.HOST}/admin/dashboard?msg=error+when+creating+book&type=danger`);
                }
                
            }
            else{

                return res.status(500).redirect(`${process.env.HOST}/admin/dashboard?msg=error+when+fetching+book+Isbn ${isbn}&type=danger`);
            }
        }
        catch(e){
            console.log(`${e.message}`);
            return res.status(500).redirect(`${process.env.HOST}/admin/dashboard?msg=error+when+fetching+book+Isbn${isbn}&type=danger`);

        }
    }

}

module.exports={
    GetinsertBook,CreateBook,saveUpdate,addBookWithISBN,getaddBookWithISBNForm
}   