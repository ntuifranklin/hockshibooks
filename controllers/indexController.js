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
let authUser;
let username;
let shippingInfo;
let items;
let session;
const showHomePage = async (req,res)=>{

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
    

    return res.render("pages/cart")
}
const getCartItems=async (req,res)=>{
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
    return res.render("pages/customerLogin",{
        msg:false
    })
}
const loginPagePost = async (req,res)=>{
    const email=req.body.email
    try {
            const user = await customerModel.findOne({
                    where: {
                            email: email,     
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
                                    authUser=user.dataValues
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
                    res.render(`pages/otpVerification`,{
                            userId:userId,
                            username:username,
                            email:user_email,
                            msg:msg,

                    })
                    return //stops futher execution if there is an error

            }

            /**
             * If no OTP record is found, render the otpVerification page with an "invalid OTP record" message.
             */
            if(!otpRecord){
                    authUser="";
                    
                    res.status(401).render(`pages/customerOtpVerification`,{
                            userId:userId,
                            username:username,
                            email:user_email,
                            msg:"invalid OTP record",

                    })
            }
            /**
             * If the OTP record is found but expired, render the otpVerification page with an "OTP expired" message.
             */
            else if(otpRecord.expiration_time < new Date()){
                    authUser="";

                    res.status(401).render(`pages/customerOtpVerification`,{
                            userId:userId,
                            email:user_email,
                            username:username,

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
                        username:username,
                            email:authUser.email,
                    }
                    await customerOtpModel.destroy({
                            where:{
                                    customerId:userId
                            }
                    })
                    
                    res.status(200).redirect(`${process.env.HOST}/`) 
            }
}) 
const signupPage= async(req,res)=>{

    const states=await provinceStateModel.findAll()
    const country=await CountryModel.findAll()

    return res.render("pages/customerSignup",{
        errors:req.body.errors?req.body.errors:false,
        countries:country,
        states:states

    })
}
const signupPost= async (req,res)=>{
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
        res.redirect(`${process.env.HOST}/`)
    }

}
const checkout = async(req,res)=>{

    try {
        items=req.body.items
        shippingInfo=req.body.shippingInfo

        if (!Array.isArray(items)) {
            return res.status(400).json({ error: 'Invalid items array' });
        }

        const lineItems = await Promise.all(items.map(async (item) => {
            let productDetails=  await bookModel.findOne({
                where:{
                    book_id:item.id
                }
            })
            let product= {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: productDetails.title,
                    },
                    unit_amount: productDetails.price*100, // amount in cents
                },
                quantity: item.qty,

            
            };
            return product
        }));
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
        return res.status(500)
    }

}

const logout=(req,res)=>{
   
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
    logout
}