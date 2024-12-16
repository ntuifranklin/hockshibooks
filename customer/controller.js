
const CountryModel=require("../models/countryModel");
const provinceStateModel=require("../models/provinceStateModel")
const customerModel=require("../models/customerModel")
const customerOtpModel=require("../models/customerOtpModel")
const orderModel=require("../models/ordersModel")
const bcrypt = require('bcrypt');
const {validationResult} =  require('express-validator');
const {generateAndSendOTP} =  require('../utilities/functions')

const customerLoginPage= async (req,res)=>{
    /**
 * Renders the customer login page with a success status code and a message indicating whether the login was successful or not.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object used to render the customer login page.
 * @return {Object} The rendered customer login page with a success status code and a message indicating whether the login was successful or not.
 */
    const states=await provinceStateModel.findAll({
        order: [
            ['province_state_name', 'ASC'],
        ],
    });
    const country=await CountryModel.findAll({
        order: [
            ['country_name', 'DESC'],
        ],
    });
    return res.render("../customer/pages/customerLogin",{
        pagetitle:"Login Page",
        msg:req.query.msg?req.query.msg:false,
        errors:req.body.errors?req.body.errors:false,
        countries:country,
        states:states,
        Sucessmsg:req.query.Sucessmsg?req.query.Sucessmsg:false,

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
    const states=await provinceStateModel.findAll({
        order: [
            ['province_state_name', 'ASC'],
        ],
    });
    const country=await CountryModel.findAll({
        order: [
            ['country_name', 'DESC'],
        ],
    });
    const email=req.body.email;
    let customer_id;
    try {
            const customer = await customerModel.findOne({
                where: {
                    email: email,
                    guest:false
                }
            });                                                   
            if(!customer){
                    console.log(`user non existent`);
                    res.status(401).render("../customer/pages/customerLogin",{
                            pagetitle:"Login Page",
                            msg:"please check your email and password again",
                            errors:false,
                            countries:country,
                            states:states,
                            Sucessmsg:req.query.Sucessmsg?req.query.Sucessmsg:false,

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
    const customer= await customerModel.findOne({
        where:{
            customer_id:customer_id
        }
    })

  

    /**
     * If no OTP record is found, render the otpVerification page with an "invalid OTP record" message.
     */
    if(!otpRecord){
            
            return res.status(401).render(`../customer/pages/customerOtpVerification`,{
                    pagetitle:"OTP Verification",
                    customer_id:customer_id,
                    username:false,
                    email:customer.email,
                    msg:"invalid OTP record",
                    successmsg:false

            })
    }
    /**
     * If the OTP record is found but expired, render the otpVerification page with an "OTP expired" message.
     */
    else if(otpRecord.expiration_time < new Date()){

            res.status(401).render(`../customer/pages/customerOtpVerification`,{
                    pagetitle:"OTP Verification",    
                    userId:userId,
                    email:customer.email,
                    msg:"OTP expired",

            })
    }else{
            /**
             * If the OTP is valid and not expired:

Set up the user session with req.session.user.
Destroy the OTP record from the database to prevent reuse.
Redirect the user to the dashboard.
                */
            req.session.customer = await JSON.parse(JSON.stringify(customer));
            
            await customerOtpModel.destroy({
                    where:{
                            customerId:customer_id
                    }
            });
            await req.session.save();
            
            return res.status(200).redirect(`/customer/profile`) 
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

    const states=await provinceStateModel.findAll({
        order: [
            ['province_state_name', 'ASC'],
        ],
    });
    const country=await CountryModel.findAll({
        order: [
            ['country_name', 'DESC'],
        ],
    });

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
       return res.status(200).redirect(`/customer/login?type=success&Sucessmsg=successfully+signed+up`) 
    }

        

    }
}

const Profile=async(req,res)=>{

    let customer = req.session.customer;
    const userInformation= await customerModel.findOne(
        {where:{customer_id:customer.customer_id},
        
        include:[{
            model:orderModel
        }]
    },
    
    )

    
    const states=await provinceStateModel.findAll()
    const current_state=await provinceStateModel.findOne({
        where:{
            province_state_id:userInformation.state_province
        }
    })
    const country=await CountryModel.findAll()
    // req.session.customer.customer_id
    const user={...userInformation.dataValues,current_state:{...current_state.dataValues},}
    //console.log(user)
    return res.render("../customer/pages/profile",{
        user:user,
        states:states,
        country:country,
        errors:req.body.errors?req.body.errors:false,
        msg:req.query.msg?req.query.msg:false,
        type:req.query.type?req.query.type:false
    })
    
   
}
const updateProfile=async(req,res)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        const err = errors.array()
        req.body.errors=err

      return Profile(req,res)
    }
    else{
        try{

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

                console.log(req.body)
                await customer.save()
                return res.status(200).redirect(`${process.env.HOST}/profile?type=success&msg=successfully+updated+profile`)
            }
            else{

                return res.status(200).redirect(`${process.env.HOST}/profile?type=danger&msg=wrong+password`)
            }
        
        }
        catch(e){
                console.log(e)
        }
        
    }
}


const logout=async (req,res)=>{
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
        
        await req.session.destroy();
        res.status(200).redirect(`/customer/login`) 
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
              // Create a guest user
              user = await customerModel.create({ email:email, guest: true });
              // Generate and store OTP
              userId=user.customer_id
              user_email=user.email
              guest=user.guest
             
             await generateAndSendOTP(user.customer_id,user.email,customerOtpModel)

             res.render("../customer/pages/customerOtpVerification",{
                username:"",
                email:user_email,
                userId:userId,
                msg:req.body.msg?req.body.msg:false

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


module.exports= {
    customerLoginPage,
    customerLoginPagePost,
    verifyCustomerOTP,
    signupPage,
    customerSignupPost,
    Profile,
    updateProfile,
    logout,
    showGuestPage,
    showForm,
    processGuestUser
}