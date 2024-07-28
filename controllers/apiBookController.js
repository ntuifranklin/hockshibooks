const axios = require('axios');
const {getBookDescription} = require("../utilities/functions")
const bookModel = require("../models/bookModel")
const inventoryModel=require("../models/inventory")
 
const getBook=async (req,res)=>{
    const isbn=req.params.isbn
    const price=req.query.price ||25
    console.log(isbn)
    const qty=10;
    
    if(isbn.length==10 || isbn.length==13){

        const url = `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&jscmd=data&format=json`;
        try{
            const response= await axios.get(url)

            const data= response.data[`ISBN:${isbn}`] 
            console.log(data)

            if(data){
               let desc= await getBookDescription(data.identifiers.openlibrary[0])
                try {
                    let createdBook=await bookModel.create({
                        title:data.title,
                        author:data.authors[0].name,
                        ISBN:data.identifiers.isbn_13[0],
                        description: desc,
                        publication_date:data.publication_date,
                        cover_image_url:data.cover.medium,
                        price:price
                    })
                    console.log(createdBook)
    
                    let inventory = await inventoryModel.create({
                        book_id:createdBook.book_id ,
                        quantity_available:qty,
                        location:"warehouse"
                    })
                    return res.status(200).json({msg:"book successfully created",book:createdBook})
                } catch (error) {
                    console.log(error)
                    return res.status(400).json({msg:"error when creating book"})

                    
                }

                
            }
            else{
                    return res.status(400).json({msg:"error during fetch",isbn:isbn})

            }



        }
        catch(e){
        return res.status(400).json({msg:"error during fetch",isbn:isbn})

        }


    }
    else{
            console.log(isbn.length) 
            return res.status(400).json({msg:"Invalid ISBN",isbn:isbn})
            
    }


}


module.exports={
    getBook
}