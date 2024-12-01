
const { Op } = require("sequelize");
const bookModel=require("../models/bookModel")

const inventoryModel=require("../models/inventory");
const {booksRouteName,booksApiRouteName} = require('./utilities');
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

module.exports = {
    booksHtmlView,
    allBooksDumpApi,
    oneBookDetailsHtmlView
}
