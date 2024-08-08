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

const bcrypt = require('bcrypt');
const sequelize = require('../config/database');
const {generateAndSendOTP}=require("../utilities/functions");
const stripe = require("stripe")(process.env.Stripe_secret_key);


let user_email;
let userId;
let username;
let shippingInfo;
let items;
let session;
let geust;


const showHomePage = async (req,res)=>{
    /**
 * Retrieves all books with their corresponding inventory information and renders the home page view.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @return {Promise<void>} - A promise that resolves when the home page view is rendered.
 */

    const books=await bookModel.findAll({
        include:[
            {model:inventoryModel}
        ]
    })
    return res.status(200).render("pages/homePage",{
        "books":books
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

    //  const newDate= convertDateFormat(book.publication_date)

    res.render("pages/productDetail",{
        book:book,
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

    return res.render("pages/cart")
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
const loginPage= (req,res)=>{
    /**
 * Renders the customer login page with a success status code and a message indicating whether the login was successful or not.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object used to render the customer login page.
 * @return {Object} The rendered customer login page with a success status code and a message indicating whether the login was successful or not.
 */
    return res.render("pages/customerLogin",{
        msg:false
    })
}
const loginPagePost = async (req,res)=>{
    /**
 * Handles the POST request for the customer login page.
 *
 * @param {Object} req - The request object containing the customer's email and password.
 * @param {Object} res - The response object used to render the customer login page or redirect to the customer OTP verification page.
 * @return {Promise<void>} - Returns a Promise that resolves with the rendered customer login page or redirects to the customer OTP verification page.
 */

    const email=req.body.email
    try {
            const user = await customerModel.findOne({
                    where: {
                            email: email,
                            geust:0     
                          }
                        });                                                   
                    if(!user){
                            
                            res.status(401).render("pages/customerLogin",{
                                    msg:"please check your email and password again",
                                       host:process.env.HOST
                            })
                    }
                    else{
                            if( await bcrypt.compare(req.body.password,user.password)){
                                username= `${user.first_name} ${user.last_name}`
                                    user_email=email
                                    userId=user.customer_id
                                    generateAndSendOTP(user.customer_id,user_email,customerOtpModel)
                            res.status(200).render(`pages/customerOtpVerification`,{
                                    userId:userId,
                                    username:username,
                                    email:user_email,
                                    msg:false,
                                    host:process.env.HOST
                            })
                    }
                            else{
                                    res.status(401).render("pages/customerLogin",{
                                            msg:"please check your email and password again",
                                            host:process.env.HOST
                                    })
                            }
                    }

          }  
          catch(e){
                  console.error('Error:', e);
  
          }
   
}


const verifyOTP=(async(req,res)=>{
    /**
     * The verifyOTP function is an asynchronous function that verifies a one-time password (OTP) sent by a user. It interacts with a database to check the OTP, handles validation errors, and manages user session data. If the OTP is valid and not expired, it sets up the user session and redirects to the dashboard.
     * 
     * 
     */

    // Extract userId and OTP from the request body
            const{userId,OTP}=req.body


            // otpModel.findOne searches for an OTP record with the matching userId and OTP.
            const otpRecord= await customerOtpModel.findOne({
                    where:{
                            customerId:userId,
                            otp:OTP
                    }
            })

            /**
             * validationResult(req) checks for any validation errors in the request.
If there are errors, render the otpVerification page with an error message.
             */
            const errors=validationResult(req)
            if(!errors.isEmpty()){
                    const {msg}=errors.array()[0]
                    res.render(`pages/customerOtpVerification`,{
                            userId:userId,
                            username:username||false,
                            email:user_email,
                            msg:msg,

                    })
                    return //stops futher execution if there is an error

            }

            /**
             * If no OTP record is found, render the otpVerification page with an "invalid OTP record" message.
             */
            if(!otpRecord){
                    
                    res.status(401).render(`pages/customerOtpVerification`,{
                            userId:userId,
                            username:username||false,
                            email:user_email,
                            msg:"invalid OTP record",

                    })
            }
            /**
             * If the OTP record is found but expired, render the otpVerification page with an "OTP expired" message.
             */
            else if(otpRecord.expiration_time < new Date()){

                    res.status(401).render(`pages/customerOtpVerification`,{
                            userId:userId,
                            email:user_email,
                            username:username||false,

                            msg:"OTP expired",

                    })
            }else{
                    /**
                     * If the OTP is valid and not expired:

    Set up the user session with req.session.user.
    Destroy the OTP record from the database to prevent reuse.
    Redirect the user to the dashboard.
                     */
                    req.session.customer={
                        geust:geust||0,
                            email:user_email,

                    }
                    geust=0
                    await customerOtpModel.destroy({
                            where:{
                                    customerId:userId
                            }
                    })
                    
                    res.status(200).redirect(`${process.env.HOST}/`) 
            }
}) 
const signupPage= async(req,res)=>{

    /**
 * Retrieves all states and countries using provinceStateModel and CountryModel, respectively.
 * Renders the "pages/customerSignup" view and passes the retrieved states, countries, and any errors present in the request body to the view for rendering.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @return {Promise<void>} - A promise that resolves when the view is rendered.
 */

    const states=await provinceStateModel.findAll()
    const country=await CountryModel.findAll()

    return res.render("pages/customerSignup",{
        errors:req.body.errors?req.body.errors:false,
        countries:country,
        states:states

    })
}
const signupPost= async (req,res)=>{
    /**
 * Handles the POST request for customer signup. Validates the request body using the validationResult function.
 * If there are validation errors, it sets the errors in the request body and redirects to the signup page.
 * If the email is already used, it adds an error message to the request body and redirects to the signup page.
 * If the email is not used, it creates a new customer record in the database and redirects to the login page.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @return {Promise<void>} - Returns a Promise that resolves when the function completes.
 */

    /**
Validates the request body using validationResult.
If validation fails, redirects to the sign-up page with error messages.
Checks if the email is already in use. If so, redirects to the sign-up page with an error message.
If the email is not in use, creates a new customer record in the database and redirects to the login page.
     */
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        const err = errors.array()
        req.body.errors=err

      return signupPage(req,res)
    }
   
    else{
        let info=req.body
        let temp= await customerModel.findAndCountAll({
            where:{
                email:info.email
            }
        }) 
        if(temp.count!=0){
            const err = errors.array()
            err.push({
                msg:"This email is already used , please consider logging in"
            })
            req.body.errors=err
    
          return signupPage(req,res)
            
        }

        else{

        
        let {country_code}= await provinceStateModel.findOne({
            where:{
                province_state_id:info.state_province
            }
        })

       let customer= await customerModel.create({
            first_name:info.first_name,
            last_name:info.last_name,
            email:info.email,
            password:info.password,
            street_address:info.street_address,
            city:info.city,
            state_province:info.state_province,
            country:country_code,
            postal_zipcode:info.postal_zipcode,
            phone:info.phone

        })
       return res.status(200).redirect(`${process.env.HOST}/login`) 
    }

        

    }
}

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
        const query= req.body.query 

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


          return res.status(200).render("pages/homePage",{
            "books":books
        })
    }catch(e){
        res.status(500).redirect(`${process.env.HOST}/`)
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

const logout=(req,res)=>{
    /**
 * The logout function is used to log out signed-in users.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
   
        /*
        the logout function is used to logout signed in users.

        It checks if the user is signed in by looking for the user property in the req.session object. If the user is not signed in, it responds with a status code of 404 and a message saying "user not signed in". If the user is signed in, it deletes the user property from the req.session object and redirects the user to the root URL of the admin section of the application (${process.env.HOST}/admin/).
        
        */ 
        if(!req.session.customer){
                res.status(404).redirect(`${process.env.HOST}/`) 
                
        }
        else{
                delete req.session.customer
                res.redirect(`${process.env.HOST}/`) 

        
}
}

const showGeustPage=(req,res)=>{
    /**
 * Renders the showGeustPage view.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @return {void}
 */
    res.render("pages/showGeustPage")
}
const showForm=(req,res)=>{
    /**
 * Renders the "pages/geustEmailForm" view and passes an optional message to it.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @return {void}
 */
    res.render("pages/geustEmailForm",{
        msg:req.body.msg?req.body.msg:false
    })
}
const processGeustUser=async (req,res)=>{
    /**
 * Processes a guest user.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @return {Promise<void>} - A promise that resolves when the function is complete.
 */

    /** 
     *
1. Validating the request data.
2.If valid, checking if the provided email already exists in the database.
3.If the email doesn't exist, creating a new guest user and generating a one-time password (OTP).
4.Sending the OTP to the user's email and rendering the OTP verification page.
5.If the email already exists or an error occurs, displaying an error message and rendering the guest email form again.*/
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        const err = errors.array()
        req.body.msg=err

      return showForm(req,res)
    }
    else
    {
        const { email,is_geust } = req.body;

        try {
            // Check if email already exists
            let user = await customerModel.findOne({ where: { email:email } });
      
            if (!user) {
              // Create a guest user
              user = await customerModel.create({ email:email, geust: true });
              // Generate and store OTP
              userId=user.customer_id
              user_email=user.email
              geust=user.geust
             
             await generateAndSendOTP(user.customer_id,user.email,customerOtpModel)

             res.render("pages/customerOtpVerification",{
                username:"",
                email:user_email,
                userId:userId,

             })
                
              // Send OTP via email
      
            } else {
                req.body.msg="this email is already registered"
                

                return showForm(req,res)
            }
          } catch (error) {
            console.error(error);
            req.body.msg=[{
                msg:"server error"
            }]

            return showForm(req,res)
          }


    }
    
}

module.exports={
    showHomePage,
    bookDetail,
    viewCart,
    getCartItems,
    loginPage,
    signupPage,
    signupPost,
    loginPagePost,
    checkout,
    searchBook,
    successPayment,
    verifyOTP,
    logout,
    showForm,
    showGeustPage,
    processGeustUser
}