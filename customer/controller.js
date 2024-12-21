
const CountryModel=require("../models/countryModel");
const provinceStateModel=require("../models/provinceStateModel")
const customerModel=require("../models/customerModel")
const customerOtpModel=require("../models/customerOtpModel")
const orderModel=require("../models/ordersModel")
const CustomerPasswordResetRequestModel = require('../models/customerPasswordResetRequestModel');

const bcrypt = require('bcrypt');
const {validationResult} =  require('express-validator');
const {generateAndSendOTP, sendCustomerResetPasswordEmail} =  require('../utilities/functions')

const {LOGGED_IN_CUSTOMER_VARIABLE_NAME} = require('../utilities/universal_web_constants');
const { generateLoggedInCustomerCacheKey } = require("./utilities");
const { saveJSONObjectToRedisCache,deleteDataFromRedisCache } = require("../middleware/redis");

let states = null ; 
let country = null; 

async function loadStatesAndCountries(){
    if (states != null && country != null) {
        return;
    };
    states=await provinceStateModel.findAll({
        order: [
            ['province_state_name', 'ASC'],
            ['country_code', 'ASC'],
        ],
    });
    country=await CountryModel.findAll({
        order: [
            ['country_name', 'ASC'],
        ],
    });
    
}

const customerLoginPage= async (req,res)=>{
    /**
 * Renders the customer login page with a success status code and a message indicating whether the login was successful or not.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object used to render the customer login page.
 * @return {Object} The rendered customer login page with a success status code and a message indicating whether the login was successful or not.
 */

    await loadStatesAndCountries();

    return res.render("../customer/pages/customerLogin",{
        pagetitle:"Login Page",
        msg:req.query.msg?req.query.msg:false,
        errors:req.body.errors?req.body.errors:false,
        countries:country,
        states:states,
        Sucessmsg:req.query.Sucessmsg?req.query.Sucessmsg:false,
        success:req.query.success?req.query.success:false

    })
}
const customerLoginPagePost = async (req,res)=>{
    /**
 * Handles the POST request for the customer login page.
 *
 * @param {Object} req - The request object containing the customer's email and password.
 * @param {Object} res - The response object used to render the customer login page or redirect to the customer OTP verification page.
 * @return {Promise<void>} - Returns a Promise that resolves with the rendered customer login page or redirects to the customer OTP verification page.
 */
    
    const email=req.body.email;
    let customer_id;
    try {
            await loadStatesAndCountries();
            const customer = await customerModel.findOne({
                where: {
                    email: email,
                    guest:false
                }
            });                                                   
            if(!customer){
                    //console.log(`user non existent`);
                    res.status(401).render("../customer/pages/customerLogin",{
                            pagetitle:"Login Page",
                            msg:"please check your email and password again",
                            errors:false,
                            countries:country,
                            states:states,
                            Sucessmsg:req.query.Sucessmsg?req.query.Sucessmsg:false,
                            success:false

                    })
            }
            else{
                    if( await bcrypt.compare(req.body.password,customer.password)){
                            
                            let customer_email=email
                            customer_id=customer.customer_id
                            generateAndSendOTP(customer_id,customer_email,customerOtpModel)
                            res.status(200).render(`../customer/pages/customerOtpVerification`,{
                                    pagetitle:"OTP Verification",
                                    customer_id:customer_id,
                                    email:customer_email,
                                    msg:false,
                                    host:process.env.HOST
                            })
                    }
                    else{
                        console.log(`user existent but wrong password`);
                        res.status(401).render("../customer/pages/customerLogin",{
                                pagetitle:"Login Page",
                                msg:"please check your email and password again",
                                errors:false,
                                countries:country,
                                states:states,
                                Sucessmsg:req.query.Sucessmsg?req.query.Sucessmsg:false,
                                success:false

                        })
                    }
            }
          }  
          catch(e){
                  console.error('Error:', e);
          }
}


const verifyCustomerOTP=(async(req,res)=>{
    /**
     * The verifyOTP function is an asynchronous function that verifies a one-time password (OTP) sent by a user. It interacts with a database to check the OTP, handles validation errors, and manages user session data. If the OTP is valid and not expired, it sets up the user session and redirects to the dashboard.
     * 
     * 
     */
    // Extract userId and OTP from the request body
    const {customer_id,OTP} =req.body

    // otpModel.findOne searches for an OTP record with the matching userId and OTP.
    const otpRecord= await customerOtpModel.findOne({
        where:{
                customerId:customer_id,
                otp:OTP
        }
    })
    let customer= await customerModel.findOne({
        where:{
            customer_id:customer_id
        }
    })

  

    /**
     * If no OTP record is found, render the otpVerification page with an "invalid OTP record" message.
     */
    if(!otpRecord){
        return res.redirect(`/customer/login?msg=invalid+OTP+record`);
        
    } else if(otpRecord.expiration_time < new Date()){
        /**
         * If the OTP record is found but expired, render the otpVerification page with an "OTP expired" message.
         */
        //still destroy the otp found regardless
        
        await customerOtpModel.destroy({
            where:{
                    customerId:customer_id
            }
        });
        return res.status(401).redirect(`/customer/login?msg=OTP+expired`);
        
    }else{
            /**
             * If the OTP is valid and not expired:

                Set up the user session with req.session.user.
                Destroy the OTP record from the database to prevent reuse.
                Redirect the user to the dashboard.
            */
            let userID = req.session.userID;
            let redisCustomerKey = generateLoggedInCustomerCacheKey(userID);
            let writeOptions =
            {
                
                EX: 900, // 15 minutes, 3600 is 1h , while 43200 is 12h
                //XX: true, // write the data even if the key already exists
            } ;
            
            customer = await JSON.parse(JSON.stringify(customer));
            await saveJSONObjectToRedisCache(redisCustomerKey, customer, writeOptions);
            
            
            await customerOtpModel.destroy({
                where:{
                        customerId:customer_id
                }
            });
            
            req.session.customer_id = customer_id;
            
            await req.session.save();       
            req.session.customer = customer;
            res.locals.customer = customer ;
            await req.session.save();       
            
            return res.status(200).redirect(`/customer/profile`) 
    }
}) ;

const customerLogout=async (req,res)=>{
    /**
 * The customerLogout function is used to log out signed-in users.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
   
        /*
        the customerLogout function is used to logout signed in users.

        It checks if the user is signed in by looking for the user property in the req.session object. If the user is not signed in, it responds with a status code of 404 and a message saying "user not signed in". If the user is signed in, it deletes the user property from the req.session object and redirects the user to the root URL of the admin section of the application (${process.env.HOST}/admin/).
        
        */
        let userID = req.session.userID;
        let redisCustomerKey = generateLoggedInCustomerCacheKey(userID); 
        await deleteDataFromRedisCache(redisCustomerKey); 
        await req.session.destroy();
        res.status(200).redirect(`/customer/login`) 
}

const signupPage= async(req,res)=>{

    /**
 * Retrieves all states and countries using provinceStateModel and CountryModel, respectively.
 * Renders the "pages/customerSignup" view and passes the retrieved states, countries, and any errors present in the request body to the view for rendering.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @return {Promise<void>} - A promise that resolves when the view is rendered.
 */

    await loadStatesAndCountries();

    return res.render("../customer/pages/customerSignup",{
        pagetitle:"Signup Page",
        errors:req.body.errors?req.body.errors:false,
        msg:false,
        sucessmsg:false,
        countries:country,
        states:states,

    })
}
const customerSignupPost= async (req,res)=>{
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

      return customerLoginPage(req,res)
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
    
          return customerLoginPage(req,res)
            
        }

        else{

        
        let {country_code}= await provinceStateModel.findOne({
            where:{
                province_state_id:info.state_province_id
            }
        })

       let customer= await customerModel.create({
            first_name:info.first_name,
            last_name:info.last_name,
            email:info.email,
            password:info.password,
            street_address:info.street_address,
            city:info.city,
            state_province_id:info.state_province_id,
            country:country_code,
            postal_zipcode:info.postal_zipcode,
            phone:info.phone

        });
       req.session.customer_id = customer.customer_id;
       //await req.session.save();
       req.session.customer = customer;
       await req.session.save();
       return res.status(200).redirect(`/customer/login?type=success&Sucessmsg=successfully+signed+up`) 
    }       

    }
}

const showCustomerProfile=async(req,res)=>{
    await loadStatesAndCountries();
    let customer = await req.session.customer;
    let customer_id = await req.session.customer_id;
    console.log(`customer: `, customer);
    console.log(`customer_id: `, customer_id);
    let customerInformation; 
    if (!customer && customer_id) {
        customerInformation = await customerModel.findOne(
            {
                where:{customer_id:customer_id},
                include:[{
                    model:orderModel
                }]
            })
    } else if (customer && customer.customer_id) {
        customerInformation = await customerModel.findOne(
            {
                where:{customer_id:customer.customer_id},
                include:[{
                    model:orderModel
                }]
            })

    } else {
        return res.status(404).redirect(`/customer/login?msg=neither+customer+id+nor+customer+object+found`);
    }
    //first select the state, two state code and country code for the customer
    
    //const states=await provinceStateModel.findAll()
    const current_state=await provinceStateModel.findOne({
        where:{
            province_state_id:customerInformation.state_province_id,
            country_code:customerInformation.country
        }
    })
    //const country=await CountryModel.findAll()
    // req.session.customer.customer_id
    console.log(`customerInformation: `, customerInformation);
    console.log(` current_state: `,current_state);
    let user;
    if (current_state) {
        user = {...customerInformation.dataValues,current_state:{...current_state.dataValues},}
    } else {
        user = customerInformation;
    }


    if (req.body.errors) {
        req.body.errors = req.body.errors.map((error) => {
            return {
                msg: error.msg,
            };
        });
    }
    //console.log(user)
    return res.render("../customer/pages/profile",{
        pagetitle:"Profile Page",
        customer:customerInformation,
        user:user,
        states:states,
        country:country,
        errors:req.body.errors?req.body.errors:false,
        msg:req.query.msg?req.query.msg:false,
        type:req.query.type?req.query.type:false,
        current_state:current_state,
    })
    
   
}
const updateCustomerProfile=async(req,res)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        const err = errors.array()
        req.body.errors=err

      return showCustomerProfile(req,res)
    } else {
        try{
            await loadStatesAndCountries();
            const customer= await customerModel.findOne(
                {where:{customer_id:userId} }
            
            )
            console.log("customer name: "+typeof(customer.newPassword))
            // console.log(await bcrypt.compare(customer.password,req.body.oldPassword))
            if(await bcrypt.compare(req.body.oldPassword,customer.password)){
                let {country_code}= await provinceStateModel.findOne({
                    where:{
                        province_state_id:req.body.state_province
                    }
                })

                customer.first_name=req.body.first_name
                customer.last_name=req.body.last_name
                customer.email=req.body.email
                customer.street_address=req.body.street_address
                customer.city=req.body.city
                customer.state_province=req.body.state_province
                customer.country=country_code
                customer.postal_zipcode=req.body.postal_zipcode
                customer.phone=req.body.phone

                console.log(req.body.newPassword==false)

                console.log(req.body.newPassword==true)


                if(req.body.newPassword){
                    console.log("provided")
                    customer.password=req.body.newPassword
                }
                else{
                    customer.password=req.body.oldPassword
                    console.log("not provided")
                    
                }

                //console.log(req.body)
                await customer.save()
                return res.status(200).redirect(`/customer/profile?type=success&msg=successfully+updated+profile`)
            }
            else{

                return res.status(200).redirect(`/customer/profile?type=danger&msg=wrong+password`)
            }
        
        }
        catch(e){
                console.log(e)
        }
        
    }
}

const customerResetPasswordForm=async(req,res)=>{
    /**
 * Renders the customer password reset form.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @return {void}
    */
    res.render("../customer/pages/customerResetPasswordForm",{
        pagetitle:"Reset Your Account Password",
        msg:req.query.msg?req.query.msg:false,
        errors:req.body.errors?req.body.errors:false,
        success:req.query.success?req.query.success:false,
    });
}

/* 
process the reset password by checking that the email 
provided is a customer's valid email.
Then generating a token and send it to the customer email as a url
*/

const processCustomerResetPasswordForm=async(req,res)=>{
    /**
 * Processes the customer password reset form.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @return {Promise<void>} - A promise that resolves when the function is complete.
 */

    const errors=validationResult(req)
    if(!errors.isEmpty()){
        const err = errors.array()
        req.body.errors=err

      return customerResetPasswordForm(req,res)
    } else {
        try{
            const {email}=req.body
            let customer= await customerModel.findOne({
                where:{
                    email:email
                }
            })
            if(!customer){
                return res.status(404).redirect(`/customer/resetPassword?msg=invalid+email`)
            }
            else{
                let token= await CustomerPasswordResetRequestModel.create({
                    customer_id:customer.customer_id,
                    expires_at: new Date(Date.now() + 3600000)
                })
                //send the token to the customer email
                if(token){
                    await sendCustomerResetPasswordEmail(customer,`${process.env.WEBSITE_URL}/customer/resetPassword/${token.token}`, token.expires_at);
                    console.log(`email sent : ${process.env.WEBSITE_URL}/customer/resetPassword/${token.token}`)
                    return res.status(200).redirect(`/customer/resetPassword?success=true&msg=check+your+email+for+the+reset+password+link`);
                } else {
                    return res.status(404).redirect(`/customer/resetPassword?success=false&msg=error+occured`);
                }
                
            }
        }
        catch(e){
            console.log(e)
        }
    }
}

const processCustomerResetPasswordToken=async(req,res)=>{
    /**
 * Processes the customer password reset token.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @return {Promise<void>} - A promise that resolves when the function is complete.
 */

    const {token}=req.params
    let resetRequest= await CustomerPasswordResetRequestModel.findOne({
        where:{
            token:token
        }
    })
    if(!resetRequest){
        return res.status(404).redirect(`/customer/resetPassword?msg=invalid+token`)
    }
    else if(resetRequest.expires_at < new Date()){
        return res.status(404).redirect(`/customer/resetPassword?msg=expired+token`)
    }
    else{
        return res.status(200).render("../customer/pages/customerNewPasswordForm",{
            pagetitle:"Reset Password",
            msg:req.query.msg?req.query.msg:false,
            errors:req.body.errors?req.body.errors:false,
            customer_id:resetRequest.customer_id,
            success:req.query.success?req.query.success:false,
            token:token
        })
    }
}

const processNewPasswordFromCustomerResetPasswordForm=async(req,res)=>{
    /**
     * Processes the new password form from the customer password reset form.
    * @param {Object} req - The request object.
    * @param {Object} res - The response object.
    * @return {Promise<void>} - A promise that resolves when the function is complete. 
    */
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        const err = errors.array()
        req.body.errors=err

      return processCustomerResetPasswordToken(req,res)
    } else {
        try{
            const {customer_id,token}=req.body
            let resetRequest= await CustomerPasswordResetRequestModel.findOne({
                where:{
                    token:token
                }
            })
            if(!resetRequest){
                return res.status(404).redirect(`/customer/resetPassword?msg=invalid+token`)
            }
            else if(resetRequest.expires_at < new Date()){
                return res.status(404).redirect(`/customer/resetPassword?msg=expired+token`)
            }
            else{
                let customer= await customerModel.findOne({
                    where:{
                        customer_id:customer_id
                    }
                })
                customer.password=req.body.password
                await customer.save()
                await resetRequest.destroy()
                return res.status(200).redirect(`/customer/login?success=true&msg=password+reset+successfully`)
            }
        }
        catch(e){
            console.log(e)
        }
    }

}
const showGuestPage=(req,res)=>{
    /**
 * Renders the showGuestPage view.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @return {void}
 */
    res.render("../customer/pages/showGuestPage")
}
const showForm=(req,res)=>{
    /**
 * Renders the "pages/guestEmailForm" view and passes an optional message to it.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @return {void}
 */
    res.render("../customer/pages/guestEmailForm",{
        msg:req.body.msg?req.body.msg:false
    })
}
const processGuestUser=async (req,res)=>{
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
        const { email,is_guest } = req.body;

        try {
            // Check if email already exists
            let user = await customerModel.findOne({ where: { email:email } });
      
            if (!user) {
              // Create a confirmed user
              user = await customerModel.create({ email:email, guest: false });
              // Generate and store OTP
              let userId=user.customer_id
              user_email=user.email
              guest=user.guest
             
             await generateAndSendOTP(user.customer_id,user.email,customerOtpModel)
             req.session.customer = user;
             await req.session.save();
             res.render("../customer/pages/customerOtpVerification",{
                username:"",
                email:user_email,
                customer_id:userId,
                msg:req.body.msg?req.body.msg:false

             })
                
              // Send OTP via email
      
            } else if (user.guest) {
                req.session.customer = user;
                await req.session.save();
                // Generate and store OTP
                await generateAndSendOTP(user.customer_id,user.email,customerOtpModel)
                res.render("../customer/pages/customerOtpVerification",{
                    username:"",
                    email:user.email,
                    customer_id:user.customer_id,
                    msg:req.body.msg?req.body.msg:false
                 });


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


module.exports= {
    loadStatesAndCountries,
    customerLoginPage,
    customerLoginPagePost,
    verifyCustomerOTP,
    signupPage,
    customerSignupPost,
    showCustomerProfile,
    updateCustomerProfile,
    customerLogout,
    customerResetPasswordForm,
    processCustomerResetPasswordForm,
    processCustomerResetPasswordToken,
    processNewPasswordFromCustomerResetPasswordForm,
    showGuestPage,
    showForm,
    processGuestUser
}