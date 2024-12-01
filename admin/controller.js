
const csrf = require('csurf');
const bcrypt = require('bcrypt');
const sequelize = require('../config/database');
const {generateAndSendOTP}=require("../utilities/functions");
const { validationResult } = require('express-validator');

const { json } = require('body-parser');
require("dotenv").config()      

//models
const powerUSer= require("../models/adminModel")
const otpModel=require("../models/otpModel")
const bookModel=require("../models/bookModel")
const genreModel=require("../models/genreModel")
const inventoryModel=require("../models/inventory")
const paymentModel=require("../models/paymentModel")
const customerModel=require("../models/customerModel")
const orderModel= require("../models/ordersModel")


//middleware
const OTPvalidation= require("../middleware/OTPmiddleware");
const validateOTP = require('../middleware/OTPmiddleware');
const { adminRouteName } = require('./utilities');
let user_email,authUser;
let userId


const login=(req,res,next)=>{

        
        //the login function renders the login page that will request the email and password of the users who wishes to login
        res.status(200)
        res.render("../admin/pages/admin_login",{
                pagetitle:"Admin Login",
                msg:false,
                host:process.env.HOST,
                admin_route_name:adminRouteName(),
        })
}
const formSubmit= async(req,res,next)=>{
        /*
        the formsubmit funtion is an async function that is used to verify if the user who wants to login exists , the logic behind it's functioning is as follows
        1. It extracts the email from the request body.
        2. It then tries to find a user with the same email in the database.
        3.If no user is found, it renders the "pages/admin_login" template with an error message.
        4. If a user is found, it checks if the provided password matches the hashed password stored in the database.
        5. If the password matches, it generates and sends an OTP (One-Time Password) for the user.
        6. It then renders the "pages/otpVerification" template with the user's ID, email, and host.
        7. If the password does not match, it renders the "pages/admin_login" template with an error message.
        8.If an error occurs during the process, it logs the error to the console.
The function uses await to handle asynchronous operations and bcrypt.compare to compare the provided password with the hashed password. The powerUSer.findOne method is used to find a user in the database. The res.render method is used to render templates. The process.env.HOST variable is used to get the host of the application.


        */
        const email=req.body.email
        try {
                const user = await powerUSer.findOne({
                        where: {
                                email: email,     
                              }
                            });                                                   
                        if(!user){
                                
                            res.status(401).render("../admin/pages/admin_login",{
                                csrfToken: req.csrfToken(),
                                msg:"please check your email and password again",
                                host:process.env.HOST,
                                admin_route_name:adminRouteName(),
                            })
                        }
                        else{
                            if( await bcrypt.compare(req.body.password,user.password)){
                                user_email=email
                                userId=user.id
                                authUser=user.dataValues
                                generateAndSendOTP(user.id,user_email,otpModel)
                                res.status(200).render(`../admin/pages/otpVerification`,{
                                    userId:userId,
                                    email:user_email,
                                    msg:false,
                                    host:process.env.HOST,
                                    admin_route_name:adminRouteName(),
                                })
                            }
                            else{
                                res.status(401).render("../admin/pages/admin_login",{
                                    csrfToken: req.csrfToken(),
                                    msg:"please check your email and password again",
                                    host:process.env.HOST,
                                    admin_route_name:adminRouteName(),
                                })
                            }
                        }
 
              }  
              catch(e){
                      console.error('Error:', e);
      
              }
       
}

const verifyOTP=(async(req,res,next)=>{
        /**
         * The verifyOTP function is an asynchronous function that verifies a one-time password (OTP) sent by a user. It interacts with a database to check the OTP, handles validation errors, and manages user session data. If the OTP is valid and not expired, it sets up the user session and redirects to the dashboard.
         * 
         * 
         */

        // Extract userId and OTP from the request body
        const{userId,OTP}=req.body


        // otpModel.findOne searches for an OTP record with the matching userId and OTP.
        const otpRecord= await otpModel.findOne({
                where:{
                        powerUserId:userId,
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
                res.render(`../admin/pages/otpVerification`,{
                        userId:userId,
                        email:user_email,
                        admin_route_name:adminRouteName(),
                        msg:msg,

                })
                return //stops futher execution if there is an error

        }

        /**
         * If no OTP record is found, render the otpVerification page with an "invalid OTP record" message.
         */

        if(!otpRecord){
                authUser="";
                
                res.status(401).render(`../admin/pages/otpVerification`,{
                        userId:userId,
                        email:user_email,
                        msg:"invalid OTP record",
                        admin_route_name:adminRouteName(),

                })
        }
        /**
         * If the OTP record is found but expired, render the otpVerification page with an "OTP expired" message.
         */
        else if(otpRecord.expiration_time < new Date()){
                authUser="";
                

                res.status(401).render(`../admin/pages/otpVerification`,{
                        userId:userId,
                        email:user_email,
                        admin_route_name:adminRouteName(),
                        msg:"OTP expired",

                })
        }else{
        /**
         * If the OTP is valid and not expired:

        Set up the user session with req.session.user.
        Destroy the OTP record from the database to prevent reuse.
        Redirect the user to the dashboard.
        */
        req.session.user={
                email:authUser.email,
                role:authUser.role
        }
        await otpModel.destroy({
                where:{
                        powerUserId:userId
                }
        })
        
        res.status(200).redirect(`/${adminRouteName()}/dashboard`) 
    }
}) 
const dashboard=async(req,res)=>{
        /*
        Inside the dashboard  handeler function, it first checks if a query parameter named msg exists in the request object. If it does, it assigns false to the msg variable; otherwise, it assigns the value of msg from the request query.

Then, it uses the await keyword to asynchronously fetch all books from the bookModel along with their associated genreModel and inventoryModel using the findAll method.

Finally, it renders a view template named "pages/dashboard" and passes the fetched books, msg, and the value of process.env.HOST as data to the template.
        */
        const msg=req.query.msg?req.query.msg:false; 
        const type=req.query.type?req.query.type:false;
 
        const books= await bookModel.findAll({
                include:[
                        {model:inventoryModel}

                ],
                
        })

        const payments= await paymentModel.findAll({})
        const orders=await orderModel.findAll({
                include:[
                        {model:customerModel}
                ]
        })
     
        // res.send(user)
        res.locals.user=req.session.user


        res.status(200).render("../admin/pages/dashboard",{
                books:books,
                payments:payments,
                orders:orders,
                type:type,
                msg:msg,
                host:process.env.HOST,
                admin_route_name:adminRouteName()
                

        })
}
const logout=(req,res)=>{
        /*
        the logout function is used to logout signed in users.

        It checks if the user is signed in by looking for the user property in the req.session object. If the user is not signed in, it responds with a status code of 404 and a message saying "user not signed in". If the user is signed in, it deletes the user property from the req.session object and redirects the user to the root URL of the admin section of the application (${process.env.HOST}/admin/).
        
        */ 
        if(!req.session.user){
                res.status(404).res.redirect(`/${adminRouteName()}`) 
                
        }
        else{
                delete req.session.user
                res.redirect(`/${adminRouteName()}`) 

        }
}
module.exports={
        login,formSubmit,verifyOTP,dashboard,logout
}