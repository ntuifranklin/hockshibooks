const { Op } = require("sequelize");
const bookModel=require("../models/bookModel")
const genreModel=require("../models/genreModel")
const inventoryModel=require("../models/inventory");
const CountryModel=require("../models/countryModel");
const provinceStateModel=require("../models/provinceStateModel")
const customerModel=require("../models/customerModel")
const customerOtpModel=require("../models/customerOtpModel")
const orderModel= require("../models/ordersModel")
const OrderItem = require("../models/orderItemsModel");
const paymentModel=require("../models/paymentModel")

const{convertDateFormat} = require("../utilities/functions");
const { validationResult } = require("express-validator");


const sequelize = require('../config/database');
const {generateAndSendOTP}=require("../utilities/functions");
const stripe = require("stripe")(process.env.stripe_secret_key);


let user_email;
let userId;
let username;
let shippingInfo;
let items;
let session;
let guest;

const {booksRouteName,booksApiRouteName} = require('../books/utilities');

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
    //console.log(`${JSON.stringify(books, null, 2)}`);
    return res.status(200).render("pages/home",{
        "books":books,
        "pagetitle":"Books Available",
        base_route_name:"books",
        api_route_name:"api"
    })


} 

const bookDetail= async (req,res)=>{
    /**
 * Retrieves a book detail by its ID and renders the "pages/productDetail" view with the book details.
 *
 * @param {Object} req - The request object containing the book ID in the parameters.
 * @param {Object} res - The response object used to render the "pages/productDetail" view.
 * @return {Promise<void>} - Returns a Promise that resolves with the rendered "pages/productDetail" view.
 */
    const param=req.params.id 

    const book= await bookModel.findOne({
        where:{
            book_id:param
        },include:[
            {model:inventoryModel}
    
    ]}
     )

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

    res.render("pages/productDetail",{
        book:book,
        pagetitle:book.title,
        relatedBooks:relatedBooks,
        release_date:""
    })
}
const viewCart= async(req,res)=>{
    /**
 * Renders the cart page view.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object used to render the cart page view.
 * @return {Promise<void>} - Returns a Promise that resolves with the rendered cart page view.
 */
    const states=await provinceStateModel.findAll()
    const country=await CountryModel.findAll()


    return res.render("pages/cart",{
        states:states,
        country:country
    })
}
const getCartItems=async (req,res)=>{
    /**
 * Retrieves the detailed cart items based on the provided cart items.
 *
 * @param {object} req - The request object containing the cart items in the body.
 * @param {object} res - The response object to send the detailed cart items.
 * @return {object[]} An array of detailed cart items with book information and quantity.
 */
    try {
        const cartItems= req.body.cartItems
    const bookIds= cartItems.map(item=> item.id)

    const books= await bookModel.findAll({
        where :{
            book_id:{
                [Op.in]:bookIds
            }
        },
        include:[{
            model:inventoryModel
        }]
    })

    const detailedcartItems=books.map(book=>{
        let imgUrl=""
        if(book.cover_image_url.split(":")[0]!="https"){
            imgUrl=`../uploads/${book.cover_image_url}`
        }else{
            imgUrl=`${book.cover_image_url}`
        }
        const cartItem=cartItems.find(item=>item.id==book.book_id)
        return{
            ...book.dataValues,
            cover_image: imgUrl,
            qty:cartItem.qty
        }
    })

    res.json(detailedcartItems);
        
    } catch (error) {
        console.error('Error fetching cart items:', error);
        res.status(500).json({ error: 'Internal Server Error' });
        
    }
}
const checkout = async(req,res)=>{

    /**
 * Creates a checkout session using Stripe API and returns the session ID in the response.
 *
 * @param {Object} req - The request object containing the items and shippingInfo in the request body.
 * @param {Object} res - The response object used to send the session ID in the response.
 * @return {Promise<void>} - Returns a Promise that resolves with the session ID in the response.
 * @throws {Error} - Throws an error if the items in the request body is not an array.
 */
    /*
   1. It retrieves the items and shippingInfo from the request body.
2.   It checks if the items is an array. If not, it returns a JSON response with an error message.
3. It initializes an empty array called lineItems.
4. It iterates over each item in the items array and retrieves the corresponding product details from a database.
5. For each product, it creates a product object with the necessary information (price, quantity, name) and adds it to the lineItems array.
6. It creates a checkout session using the stripe.checkout.sessions.create method, passing in the lineItems, success and cancel URLs, and other configuration options.
7. It sends a JSON response with the session ID.
8. If any error occurs during the process, it logs the error and sends a 500 Internal Server Error response.
    */
    try {
        items=req.body.items
        shippingInfo=req.body.shippingInfo

        if (!Array.isArray(items)) {
            return res.status(400).json({ error: 'Invalid items array' });
        }

    //     const lineItems = await Promise.all(items.map(async (item) => {
    //         let productDetails=  await bookModel.findOne({
    //             where:{
    //                 book_id:item.id
    //             }
    //         })
    //         let product;
    //         if(productDetails == true){
    //         product= {
    //             price_data: {
    //                 currency: 'usd',
    //                 product_data: {
    //                     name: productDetails.title,
    //                 },
    //                 unit_amount: productDetails.price*100, // amount in cents
    //             },
    //             quantity: item.qty,

            
    //         };
    //         console.log(product)
    //     }
        
    //     return product
    //     }
    
    // ));

    let lineItems=[]
    for(let i=0;i<items.length;i++){
        let productDetails=  await bookModel.findOne({
            where:{
                book_id:items[i].id
            }
        })
                    let product;
                    if(productDetails!=null){
                    product= {
                        price_data: {
                            currency: 'usd',
                            product_data: {
                                name: productDetails.title,
                            },
                            unit_amount: productDetails.price*100, // amount in cents
                        },
                        quantity: items[i].qty,
        
                    
                    };
                    lineItems.push(product)
                }
                else {
                    continue
                }
                
                }

                console.log(lineItems)
    
         session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${process.env.HOST}/success`,
            cancel_url: `${process.env.HOST}/`,
        })      

        res.json({ id: session.id });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

const successPayment = async(req,res)=>{
    /**
 * Creates a new order in the orderModel with the customer ID, order date, total amount, payment status, shipping address, city, state, country, postal code, and delivery status.
 * Iterates over the items array and for each item, retrieves the product details from the bookModel and checks if the product details are not null.
 * If the product details are not null, creates a new order item in the OrderItem model with the order ID, book ID, quantity, item price, and subtotal.
 * Updates the quantity available in the inventory model by subtracting the quantity of the item.
 * Saves the updated inventory model.
 * After processing all the items, creates a payment record in the paymentModel with the order ID, payment date, payment method, amount, and transaction ID.
 * Renders the "pages/successPage" view with a success status code.
 *
 * @param {Object} req - The request object containing the session and items in the request body.
 * @param {Object} res - The response object used to render the "pages/successPage" view or redirect to an error page.
 * @return {Promise<void>} - Returns a Promise that resolves with the success status code or redirects to an error page.
 */

    /**
     * 
     * 1. It retrieves the customer_id from the customerModel based on the email stored in the session.
        2. It creates a new order in the orderModel with the customer ID, order date, total amount, payment status, shipping address, city, state, country, postal code, and delivery status.
        3. It iterates over the items array and for each item, it retrieves the product details from the bookModel and checks if the product details are not null.
        4.If the product details are not null, it creates a new order item in the OrderItem model with the order ID, book ID, quantity, item price, and subtotal.
        5.It updates the quantity available in the inventory model by subtracting the quantity of the item.
        6.It saves the updated inventory model.
        7.After processing all the items, it creates a payment record in the paymentModel with the order ID, payment date, payment method, amount, and transaction ID.
        8.Finally, it renders the "pages/successPage" view with a success status code.
     */

    try{

    const { customer_id}= await customerModel.findOne({
        where:{
            email:req.session.customer.email
        }
    })
    const order = await orderModel.create({
        customer_id:  customer_id, // Assuming user is authenticated
        order_date: new Date(),
        total_amount: session.amount_total / 100,
        payment_status: 'Pending',
        shipping_address: shippingInfo.address,
        shipping_city: shippingInfo.city,
        shipping_state_province: shippingInfo.state,
        shipping_country: shippingInfo.country,
        shipping_postal_code: shippingInfo.postalCode,
        delivery_status: 'Processing'
      });
      for (const item of items) {
        let productDetails=  await bookModel.findOne({
            where:{
                book_id:item.id
            },include:[
                {model:inventoryModel}
            ]
        })
        if(productDetails!=null){
        await OrderItem.create({
          order_id: order.order_id,
          book_id: item.id,
          quantity: item.qty,
          item_price: productDetails.price,
          subtotal: item.qty * productDetails.price
            
        });

        productDetails.Inventory.quantity_available-=item.qty

        await productDetails.Inventory.save()
    }
    else{
        continue
    }
    }
    const payments= await paymentModel.create({
        order_id: order.order_id,
        payment_date: new Date(),
        payment_method: session.payment_method_types[0],
        amount: order.total_amount,
        transaction_id: session.id
      });

      return res.status(200).render("pages/successPage")
    }
    catch(err){
        return res.status(500).redirect(`${process.env.HOST}/`)
    }

}


const viewBooks = async(req,res)=>{

    return res.render("pages/books", {
        "pagetitle":"Books Available"
    })
}

const allBooks=async(req,res)=>{
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

}

const orderDetail= async(req,res)=>{
    if(!res.locals.customer){

        return res.redirect(`${process.env.HOST}/login?msg=Please+login+first`)
    }
    else{
        
        if(!req.params.id){

        return res.redirect(`${process.env.HOST}/login?msg=Please+login+first`)

        }
        else{
           try{

           
            const orderId=req.params.id
            const Order=await orderModel.findOne({
                where:[
                    {
                        order_id:orderId
                    }
                ]
            })
            const orderItems= await OrderItem.findAll({
                where:[
                    {order_id:orderId}
                ],
                include:[
                    {model:bookModel}
                ]
            })
            console.log(orderItems)
            return res.render("pages/orderDetail",{
                order:Order,
                orderItems:orderItems

            })
        }
        catch(e){
            return res.redirect(`${process.env.HOST}/login?msg=An+Error+Occured+Please+login`)

        }
        }
    }



    // try{

           
    //             const orderId=req.params.id
    //             const Order=await orderModel.findOne({
    //                 where:[
    //                     {
    //                         order_id:orderId
    //                     }
    //                 ]
    //             })
    //             const orderItems= await OrderItem.findAll({
    //                 where:[
    //                     {order_id:orderId}
    //                 ],
    //                 include:[
    //                     {model:bookModel}
    //                 ]
    //             })
    //             console.log(orderItems)

    //             console.log(orderItems[0].Book)
    //             return res.render("pages/orderDetail",{
    //                 order:Order,
    //                 orderItems:orderItems
    
    //             })
    //         }
    //         catch(e){
    //         return res.redirect(`${process.env.HOST}/login?msg=An+Error+Occured+Please+login`)
    
    //         }


}

const showError404 = (req, res) => {
    
    return res.status(200).render("pages/404",{
        "pagetitle":"Error 404 Page not found"
    })

}


module.exports={
    showHomePage,
    bookDetail,
    viewCart,
    getCartItems,
    checkout,
    successPayment,
    viewBooks,
    allBooks,
    orderDetail,
    showError404
}