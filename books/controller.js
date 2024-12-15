
const { Op } = require("sequelize");
const bookModel=require("../models/bookModel")
const { validationResult } = require('express-validator');
const inventoryModel=require("../models/inventory");
const axios = require('axios');

const fs=require("fs");
const path=require("path");
const { getBookDescription, createDefaultBookImage } = require("../utilities/functions");
const {uploadImageToCloudFlare} = require('../utilities/cloudflare_image_upload');
const { generateSeoFriendlyTitle } = require("./utilities");
const booksHtmlView = async(req,res)=>{

    //dir_where_node_started/books_folder/pages_folder
    return res.render("../books/pages/books", {
        "pagetitle":"Books Available",
        books_route_name:"books",
        add_books_route_name: "addBookWithExternalAPI",
    })
}

const allBooksDumpApi=async(req,res)=>{
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const books = await bookModel.findAll({
            limit: limit,
            offset: offset,
            include:[
                {model:inventoryModel}
            ]
        });

        const totalItems = await bookModel.count();
        const totalPages = Math.ceil(totalItems / limit);

        res.status(200).json({
            data: books,
            meta: {
                totalItems: totalItems,
                totalPages: totalPages,
                currentPage: page,
                nextPage: page < totalPages ? page + 1 : null,
                prevPage: page > 1 ? page - 1 : null,
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }

} ;


const oneBookDetailsHtmlView= async (req,res)=>{
    /**
 * Retrieves a book detail by its ID and renders the "pages/productDetail" view with the book details.
 *
 * @param {Object} req - The request object containing the book ID in the parameters.
 * @param {Object} res - The response object used to render the "pages/productDetail" view.
 * @return {Promise<void>} - Returns a Promise that resolves with the rendered "pages/productDetail" view.
 */
    const param=req.params.seo_friendly_title ;

    const book= await bookModel.findOne({
        where:{
            seo_friendly_title:param
        },
        include:[
            {model:inventoryModel}
        ]
    })
    if (!book){
        return res.status(404).redirect("/f404");
    }

    //console.log(`book found: ${JSON.stringify(book,null, 2)}`);

     const relatedBooks= await bookModel.findAll({
        where: {
            book_id: {
                [Op.ne]: book.book_id // Exclude the current book
            },
            [Op.or]: [
              { author: { [Op.like]: `%${book.author}%` } }]
            },
            include:[
            {model:inventoryModel}
    
    ]}
     )

    


    //  const newDate= convertDateFormat(book.publication_date)

    //dir_where_node_started/books_folder/pages_folder
    const bookTitle = book.title ;
    const author = book.author ;
    const  fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    const customBookSeo = {
        seoTitle: `${bookTitle} | ${author}`,
        fullUrl: `${fullUrl}`,
        image_url:`${book.cover_image_url}`,
        type:`book`,
        author: author,
        description:`${book.description}`, 
        keywords: `${bookTitle}, ${author}, ${book.description}` 
    };
    //console.log(`${JSON.stringify(customBookSeo, null, 2)}`);
    res.render("../books/pages/oneBookDetails",{
        book:book,
        pagetitle:`${bookTitle} | ${author} | Book Details `,
        relatedBooks:relatedBooks,
        release_date:"",
        books_route_name:"books",
        add_books_route_name: "addBookWithExternalAPI",
        customBookSeo: customBookSeo
    })
};


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
    let isbn=req.body.isbn
    const price=req.body.price || 25
    const qty=req.body.quantity || 1;
 
    let user = req.session.USER;
    //isbn could be less than 10 or less than 8 characters. lets pad it with 000s
    
    const url = `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&jscmd=data&format=json`;
    try{
        const response= await axios.get(url)

        console.log(`${JSON.stringify(response.data, null,2)}`);

        const data= response.data[`ISBN:${isbn}`] 

        if(data){
            let desc= await getBookDescription(data.identifiers.openlibrary[0])
            try {
                const bookMightExistInInventory=await bookModel.findOne({
                    where:{
                        ISBN:isbn
                    }
                })
                /* ISBN coul return a valid 13 o a valid 10 isbn numbers */
                var isbn10_or_13 = isbn;
                if (typeof data.identifiers.isbn_13 != "undefined")
                    isbn10_or_13 = data.identifiers.isbn_13[0];
                else if (typeof data.identifiers.isbn_10 != "undefined")
                    isbn10_or_13 = data.identifiers.isbn_10[0];

                const seo_friendly_title = generateSeoFriendlyTitle(
                    bookTitle=data.title, 
                    authorName=data.authors[0].name,
                    publicationYear=data.publication_date,
                    bookISBN=isbn10_or_13
                );
                    
                var cover_image_url = "";
                var cover_image_url_small = "";
                var cover_image_url_medium = "";
                var cover_image_url_large = "";
                let filename_for_cloudflare = "";
                let localPath = "";
                if (typeof data.cover != "undefined" && typeof data.cover.medium != "undefined"){
                    //here an image was returned by open library
                    cover_image_url = data.cover.large;
                    cover_image_url_small = data.cover.small;
                    cover_image_url_medium = data.cover.medium;
                    cover_image_url_large = data.cover.large;
                    //download the file to local uploads folder using axios, then upload it to cloudflare
                } else {
                    //here no image was returned by open library
                    //create a default image
                    try{
                        //large: 333x475
                        //medium: 180x274
                        //small: 38x58
                        cover_image_url = await createDefaultBookImage(width=333, height=475,imageTitle=seo_friendly_title+"-large-cover");  
                        cover_image_url_large = cover_image_url
                        cover_image_url_small = await createDefaultBookImage(width=60, height=92,imageTitle=seo_friendly_title+"-small-cover");
                        cover_image_url_medium = await createDefaultBookImage(width=180, height=274,imageTitle=seo_friendly_title+"-medium-cover");

                    } catch(e){
                        console.log(`Error creating default image: ${e.message}`);
                    }
                } ;
                
                

                if(!bookMightExistInInventory){
                    let createdBook=await bookModel.create({
                        seo_friendly_title:seo_friendly_title,
                        title:data.title,
                        author:data.authors[0].name,
                        ISBN:isbn10_or_13,
                        description: desc,
                        number_of_pages:data.number_of_pages,
                        publication_date:data.publish_date,
                        cover_image_url:cover_image_url,
                        cover_image_url_small:cover_image_url_small,
                        cover_image_url_medium:cover_image_url_medium,
                        cover_image_url_large:cover_image_url_large,
                        price:price
                    }) 
    
                    let inventory = await inventoryModel.create({
                        book_id:createdBook.book_id ,
                        quantity_available:qty,
                        location:"warehouse"
                    })

                    return res.status(201).json({
                        msg:`${createdBook.title} was successfully added`,
                        success:true,
                        data:{
                            book:createdBook,
                            inventory:inventory
                        } 
                    });
                } else {

                    //book exists. let's check the inventory, and add the book only if the inventory is 0
                    let inventory = await inventoryModel.findOne({
                        where:{
                            book_id:bookMightExistInInventory.book_id
                        }
                    });
                    /* 
                    maybe a new image is available at open library. 
                    If it is then lets update the image if the image we have is empty 
                    */
                    if (cover_image_url && bookMightExistInInventory.cover_image_url == ""){
                        bookMightExistInInventory.cover_image_url = cover_image_url;
                        bookMightExistInInventory.cover_image_url_small = cover_image_url_small;
                        bookMightExistInInventory.cover_image_url_medium = cover_image_url_medium;
                        bookMightExistInInventory.cover_image_url_large = cover_image_url_large;
                        await bookMightExistInInventory.save();
                    }
                    
                    //if inventory is 0, update the quantity available to the new quaantity
                    if(inventory && inventory.quantity_available && inventory.quantity_available < 1){
                        inventory.quantity_available=qty;
                        //also update the book price
                        bookMightExistInInventory.price=price;
                        //save the changes
                        await inventory.save();
                        await bookMightExistInInventory.save();

                        return res.status(201).json({
                                success:true,
                                msg:`${bookMightExistInInventory.title}'s quantity and price data updated+successfully`,
                                data:{
                                    book:bookMightExistInInventory,
                                    inventory:inventory
                                },
                                statusCode:201
                               });
                    } else { 

                        return res.status(400).json({
                            success:false,
                            error:"a book with this title already exists",
                            statusCode:400
                        })

                    }                    
                }
            } catch (error) {
                console.log(`${error.message}`);
                return res.status(400).json({
                    success:false,
                    error:`error when adding book to database: ${error.message}`,
                    statusCode:400
                });
            }
        } else {
            return res.status(404).json({
                success:false,
                error:`error when fetching book Isbn ${isbn}`,
                statusCode:404
            })            
        }
    } catch(e) {
        console.log(`${e.message}`);
        return res.status(404).json({
            success:false,
            error:`error when fetching book Isbn ${isbn}`,
            statusCode:404
        })
    }
} ;

const getAddBookWithISBNForm=(req,res)=>{
    /**
 * Renders the "pages/addBookWithISBNForm" template with a message set to false.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @return {Promise<void>} A promise that resolves when the template is rendered.
 */

    //This code will not run if an admin user is not logged in.
    let user = req.session.USER;
    res.status(200).render("../books/pages/addBookWithISBNForm",{
        pagetitle:"Add Book with ISBN",
        user:user,
        msg:false,
        books_route_name:"books",
        add_books_route_name: "addBookWithExternalAPI",

    })
} ;

const searchBook=async (req,res)=>{
    /**
     * Searches for books based on a query and renders the home page with the search results.
     *
     * @param {Object} req - The request object containing the query parameter.
     * @param {Object} res - The response object used to render the home page with the search results.
     * @return {Promise<void>} - Returns a promise that resolves when the home page is rendered with the search results.
     */
    
    /**
    It extracts the search query from the request body (req.body.query).
    It uses the bookModel to search for books where the title, author, or ISBN matches the query (case-insensitive).
    It includes the inventoryModel in the search results.
    If the search is successful, it renders the homePage template with the search results (books) and returns a 200 status code.
    If an error occurs, it redirects to the root URL with a 500 status code.
    */
        try{
            let query= req.body.query 
            query = query.trim();
            //console.log(`Searching for query: ${query}`);
            const books= await bookModel.findAll({
                where: {
                  [Op.or]: [
                    { title: { [Op.like]: `%${query}%` } }, // Op.iLike is for case-insensitive search in PostgreSQL
                    { author: { [Op.like]: `%${query}%` } },
                    { isbn: { [Op.like]: `%${query}%` } }
                  ]
                },
                include:[
                    {model:inventoryModel}
                ]
              });
    
    
              return res.status(200).render("../books/pages/search",{
                "books":books,
                "pagetitle":"Search Books",
                base_route_name:"books",
                api_route_name:"api"
            })
        }catch(e){
            res.status(200).redirect(`/`)
        }
    
    };



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
         let returnMessage = "";
          
          if (book) {
                console.log(`Deleting book: ${JSON.stringify(book, null, 2)}`);
                if (book.cover_image_url != null) {
                    console.log(`Deleting cover image: ${book.cover_image_url}`);
                    /* check that the cover image url is not hosted on another server, 
                    meaning starts with http or htps */
                    if (!book.cover_image_url.startsWith("http")){
                        let coverImagePath = path.join(process.env.ROOT_PATH, 'views','uploads',book.cover_image_url);
                        // Delete the cover image file
                        fs.unlink(coverImagePath, async (err) => {
                            if (err) {
                                returnMessage += `Error deleting cover image: ${err.message}`;        
                            } 
                        })
                        coverImagePath = path.join(process.env.ROOT_PATH, 'views','uploads',book.cover_image_url_small);
                        // Delete the cover image file
                        fs.unlink(coverImagePath, async (err) => {
                            if (err) {
                                returnMessage += `Error deleting cover image small format: ${err.message}`;        
                            } 
                        })
                        coverImagePath = path.join(process.env.ROOT_PATH, 'views','uploads',book.cover_image_url_medium);
                        // Delete the cover image file
                        fs.unlink(coverImagePath, async (err) => {
                            if (err) {
                                returnMessage += `Error deleting cover image medium format: ${err.message}`;        
                            } 
                        })
                    }
                }
                let oldTitle = book.title;
                await book.destroy()
                let s = returnMessage.length > 0 ? returnMessage.trim().replace(/ /g, "+") + '&type=danger' : `Book+${oldTitle}+successfully+deleted&type=success`;
                return res.redirect(`/admin/dashboard?msg=${s}`);
          }         
          
      }
      catch(e){
          console.log(`${e.message}`);
          let s = e.message.trim().replace(/ /g, "+") + '&type=danger';
          return res.status(500).redirect(`/admin/dashboard?msg=${s}`);
  
      }
  } ;

  
const getUpdateBookForm=async (req,res)=>{ 
    let updateBookId=req.params.id?req.params.id:req.body.bookId
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
    let book= res.locals.bookToUpdate;
    if (!book){
        return res.status(404).redirect('/admin/dashboard?msg=book+not+found&type=danger');
    }
    return res.render("../books/pages/updateBookForm",{
        user:req.session.USER,
        pagetitle:"Update Book",
        book:book,
        root_path:process.env.ROOT_PATH,
        image:book.cover_image_url,
        msg:error,
        success:false,
    });
} ;


const saveUpdateBookFormData=async(req,res)=>{
    /**
     * The saveUpdate function handles updating a book and its associated inventory record. It first retrieves the book and inventory records by the book ID, updates the fields with the new data, deletes the old cover image file if a new file is uploaded, and saves the changes to the database. 
     */ 
    try{
        /**
         * The function retrieves the book and inventory records from the database using the primary key (bookId). If the book or inventory records are not found, it returns a 404 error.
         */
        const book= await bookModel.findByPk(req.body.bookId)
        const inventory=await inventoryModel.findByPk(req.body.bookId)

       
            //The function updates the fields of the book and inventory records with the data from the request body.
            //only update fields that have changed
            if(req.body.title != book.title){
                book.set({title:req.body.title.trim()})
            } ;
            if(req.body.author != book.author){
                book.set({author:req.body.author.trim()})
            };
            if(req.body.language != book.language){
                book.set({language:req.body.language.trim()})
            };
            if(req.body.price != book.price){
                book.set({price:req.body.price})
            };
            if(req.body.description != book.description){
                book.set({description:req.body.description.trim()})
            };
            if(req.body.date != book.publication_date){
                book.set({publication_date:req.body.date})
            };
            if(req.body.quantity != inventory.quantity_available){
                inventory.set({quantity_available:req.body.quantity})
            };
            if(req.body.location != inventory.location){
                inventory.set({location:req.body.location.trim()})
            };        

            let localPath = "";
            //the file name in body is called coverImage
            /* Access the file in the request body using the req.file property. If a file is uploaded, the function sets the cover image URL of the book record to the new file path. */
            
            if(req.file){
                //only unlink all files if files are local
                
                if(book.cover_image_url && !book.cover_image_url.startsWith("http")){
                    //files are local
                    
                    //If a new file is uploaded, the old cover image file is deleted from the file system, and the new file path is set.
                    coverImagePath = path.join(process.env.ROOT_PATH, book.cover_image_url);
                    // Delete the cover image file
                    fs.unlink(coverImagePath, async (err) => {
                        if (err) {
                            return res.status(500).redirect(`${process.env.HOST}/admin/dashboard?msg=error+when+deleting+image&type=danger`);;
                        }
                    }) 
                    //If a new file is uploaded, the old cover image file is deleted from the file system, and the new file path is set.
                    coverImagePath = path.join(process.env.ROOT_PATH, book.cover_image_url_small);
                    // Delete the cover image file
                    fs.unlink(coverImagePath, async (err) => {
                        if (err) {
                            return res.status(500).redirect(`${process.env.HOST}/admin/dashboard?msg=error+when+deleting+image&type=danger`);;
                        }
                    })
                     
                    //If a new file is uploaded, the old cover image file is deleted from the file system, and the new file path is set.
                    coverImagePath = path.join(process.env.ROOT_PATH, book.cover_image_url_medium);
                    // Delete the cover image file
                    fs.unlink(coverImagePath, async (err) => {
                        if (err) {
                            return res.status(500).redirect(`${process.env.HOST}/admin/dashboard?msg=error+when+deleting+image&type=danger`);;
                        }
                    })

                    //rename uploaded file to seo_friendly_title
                    let filename = req.file.path.split("/")[2];
                    let newFilename = path.join(process.env.ROOT_PATH, 'views','uploads',book.seo_friendly_title);
                    fs.renameSync(req.file);
                    book.set({cover_image_url:newFilename.split("/")[3]})  

                } else if(book.cover_image_url) {
                    //files are remote
                    book.set({cover_image_url:req.body.coverImage})
                }
                
           }
          

           //The function saves the updated book and inventory records to the database.

           await book.save()
           await inventory.save()

            //After successful update, the user is redirected to the dashboard with a success message.
            res.redirect(`/admin/dashboard?msg=item+successfully+updated&type=success`);     
    
    }
    
    catch(e){
        console.log(`${e.message}`);
        return res.status(500).redirect(`/admin/dashboard?msg=server+error&type=danger`);
    }


}




module.exports = {
    booksHtmlView,
    allBooksDumpApi,
    oneBookDetailsHtmlView,
    addBookWithISBN,
    getAddBookWithISBNForm,
    searchBook,
    deleteBook,
    getUpdateBookForm,
    saveUpdateBookFormData
}
