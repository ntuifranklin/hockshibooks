
const { Op } = require("sequelize");
const bookModel=require("../models/bookModel")

const inventoryModel=require("../models/inventory");
const {booksRouteName,booksApiRouteName, addBooksWithISBNOnlyRouteName} = require('./utilities');
const { adminRouteName } = require("../admin/utilities");
const booksHtmlView = async(req,res)=>{

    //dir_where_node_started/books_folder/pages_folder

    return res.render("../books/pages/books", {
        "pagetitle":"Books Available",
        base_route_name:booksRouteName(),
        api_route_name:booksApiRouteName()
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
        base_route_name:booksRouteName(),
        api_route_name:booksApiRouteName(),
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
    const isbn=req.body.isbn
    const price=req.body.price || 25
    const qty=10;
    const errors=validationResult(req)
    
    if(!errors.isEmpty()){
        const err=errors.array()[0]
        res.render("../books/pages/addBookWithISBNForm",{
            msg:err,
            books_route_name:booksRouteName(),
            add_books_route_name: addBooksWithISBNOnlyRouteName(),
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

                    return res.status(302).redirect(`/${adminRouteName()}/dashboard?msg=${createdBook.title}+was+successfully+added&type=success`);
                }
                else{

                    res.status(500).render("../books/pages/addBookWithISBNForm",{
                        msg:{
                            msg:"a book with this title already exists"
                        },
                        books_route_name:booksRouteName(),
                        add_books_route_name: addBooksWithISBNOnlyRouteName(),
                    })
                }
                } catch (error) {
                    console.log(`${error.message}`);
                    return res.status(500).redirect(`/${adminRouteName()}/dashboard?msg=error+when+creating+book&type=danger`);
                }
                
            }
            else{

                return res.status(500).redirect(`/${adminRouteName()}/dashboard?msg=error+when+fetching+book+Isbn ${isbn}&type=danger`);
            }
        }
        catch(e){
            console.log(`${e.message}`);
            return res.status(500).redirect(`/${adminRouteName()}/dashboard?msg=error+when+fetching+book+Isbn${isbn}&type=danger`);

        }
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
    res.status(200).render("../books/pages/addBookWithISBNForm",{
        msg:false,
        books_route_name:booksRouteName(),
        add_books_route_name: addBooksWithISBNOnlyRouteName(),

    })
}

module.exports = {
    booksHtmlView,
    allBooksDumpApi,
    oneBookDetailsHtmlView,
    addBookWithISBN,
    getAddBookWithISBNForm
}
