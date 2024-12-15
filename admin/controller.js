

const bcrypt = require('bcrypt');

const {generateAndSendOTP}=require("../utilities/functions");
const { validationResult } = require('express-validator');
const { retrieveJSONObjectFromRedisCache, 
        deleteDataFromRedisCache, 
        writeDataToRedisCache
} = require('../middleware/redis');

require("dotenv").config()      

//models
const powerUSer= require("../models/adminModel")
const otpModel=require("../models/otpModel")
const bookModel=require("../models/bookModel")

const inventoryModel=require("../models/inventory")
const paymentModel=require("../models/paymentModel")
const customerModel=require("../models/customerModel")
const orderModel= require("../models/ordersModel")


//middleware
const { adminRouteName, generateLoggedInUserCacheKey } = require('./utilities');

let user_email;
let userId


const login=async (req,res,next)=>{        
                
        return res.render("../admin/pages/admin_login",{
                pagetitle:"Admin Login",
                msg:false,
                host:process.env.HOST,
                admin_route_name:"admin",
                user:false,
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
                                admin_route_name:"admin",
                                user:false
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
                                    admin_route_name:"admin",
                                    user:false,
                                })
                            }
                            else{
                                res.status(401).render("../admin/pages/admin_login",{
                                    csrfToken: req.csrfToken(),
                                    msg:"please check your email and password again",
                                    host:process.env.HOST,
                                    admin_route_name:adminRouteName(),
                                    user:false,
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
                        admin_route_name:"admin",
                        msg:msg,
                        user:false

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
                        msg:"invalid OTP record",
                        admin_route_name:"admin",
                        user:false

                });
                return ;
        }
        /**
         * If the OTP record is found but expired, render the otpVerification page with an "OTP expired" message.
         */
        else if(otpRecord.expiration_time < new Date()){
                authUser="";               

                res.status(200).render(`../admin/pages/admin_login`,{
                        userId:userId,
                        admin_route_name:"admin",
                        msg:"OTP expired",
                        user:false

                })
        }else{
        /**
         * If the OTP is valid and not expired:

        Set up the user session with req.session.user.
        Destroy the OTP record from the database to prevent reuse.
        Redirect the user to the dashboard.
        */
        let authUser = await powerUSer.findOne({
                where: {
                        id: userId,     
                }
        }); 
        let unixEpoch = Math.floor((new Date())/1000) ;
        let loggedInUser ={
                'userId':authUser.id,
                'role':authUser.role,
                'loggedInTime':unixEpoch,
                'email': authUser.email
        };
        let writeOptions =
        {
            
            EX: 900, // 15 minutes, 3600 is 1h , while 43200 is 12h
            //XX: true, // write the data even if the key already exists
        } ;
        //this is a uuv4 assigned at the start of the request
        let userKey = generateLoggedInUserCacheKey(req.session.userID);
        await writeDataToRedisCache(userKey, JSON.stringify(loggedInUser), writeOptions);
        //await saveJSONObjectToRedisCache(userKey, loggedInUser, writeOptions);
               
        await otpModel.destroy({
                where:{
                        powerUserId:userId
                }
        }) ;
        //let testUser = await retrieveJSONObjectFromRedisCache(userKey) ;
        //console.log(`User retrieved from cache: ${JSON.stringify(testUser)}`);
        req.session.USER = loggedInUser ;
        req.session.user=loggedInUser;
        await req.session.save();
        
        res.status(200).redirect(`/admin/dashboard`) 
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
     
        let user = req.session.user; ;
        //console.log(`${JSON.stringify(loggedInUser)}`);

        res.status(200).render("../admin/pages/dashboard",{
                books:books,
                payments:payments,
                orders:orders,
                type:type,
                msg:msg,
                host:process.env.HOST,
                admin_route_name:"admin",
                books_route_name:"books",
                add_books_route_name: "addBookWithExternalAPI",
                user: user
        })
}
const logout=async(req,res)=>{
        /*
        the logout function is used to logout signed in users.

        It checks if the user is signed in by looking for the user property in the req.session object. If the user is not signed in, it responds with a status code of 404 and a message saying "user not signed in". If the user is signed in, it deletes the user property from the req.session object and redirects the user to the root URL of the admin section of the application (${process.env.HOST}/admin/).
        
        */ 
       try{
        
                
                let userKey = generateLoggedInUserCacheKey(req.session.userID);
                const loggedInUser = await retrieveJSONObjectFromRedisCache(userKey) ;
                if(!loggedInUser)
                        return res.status(404).redirect(`/admin`)   
                
                
                await deleteDataFromRedisCache(userKey) ;
                await req.session.destroy();
                return res.status(200).redirect(`/admin`) 

        } catch(e){
                console.error('Error:', e);
        }
}
module.exports={
        login,formSubmit,verifyOTP,dashboard,logout
}