const { Op } = require("sequelize");
const bookModel=require("../models/bookModel")

const inventoryModel=require("../models/inventory");



let customer ;


const showHomePage = async (req,res)=>{
    /**
 * Retrieves all books with their corresponding inventory information and renders the home page view.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @return {Promise<void>} - A promise that resolves when the home page view is rendered.
 */

    
    const books=await bookModel.findAll({
        limit:8,
        include:[
            {model:inventoryModel}
        ], 
    });
    
    customer = req.session.customer;
    //console.log(`${JSON.stringify(books, null, 2)}`);
    return res.status(200).render("pages/home",{
        "books":books,
        "pagetitle":"Curated Used Books for Personal Growth, Business, Tech, and Science",
        base_route_name:"books",
        api_route_name:"api",
        customer:customer
    })


} 

const showError404 = (req, res) => {
    customer = req.session.customer;
    return res.status(200).render("pages/404",{
        "pagetitle":"Error 404 Page not found",
        customer:customer
    })

}


module.exports={
    showHomePage,
    showError404
}