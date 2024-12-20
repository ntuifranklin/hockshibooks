const { Op } = require("sequelize");
const sequelize = require('../config/database');
const bookModel=require("../models/bookModel")

const inventoryModel=require("../models/inventory");
const CountryModel=require("../models/countryModel");
const provinceStateModel=require("../models/provinceStateModel")
const customerModel=require("../models/customerModel")
const orderModel= require("../models/ordersModel")
const OrderItem = require("../models/orderItemsModel");
const paymentModel=require("../models/paymentModel")
const{sendCustomerNewOrderEmailNotofication} = require("../utilities/functions");
const { generateUniqueCartSessionRedisCacheKey } = require("../cart/utilities");
const { retrieveJSONObjectFromRedisCache, deleteDataFromRedisCache } = require("../middleware/redis");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
let customer;
const askShippingInfo = async(req, res) => {
    /**
     * Renders the checkout page view with the shipping information form.
     *
     * @param {Object} req - The request object.
     * @param {Object} res - The response object used to render the checkout page view.
     * @return {void} - Returns the rendered checkout page view.
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
    
    res.render("../checkout/pages/checkout_ask_shipping_info",{
        pagetitle:"fill in your shipping details",
        checkoutPage:true,
        states:states,
        country:country
    })
} ;
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
        
        //let shippingInfo=req.body.shippingInfo ;
        //get the cart items from redis session cache
               
        const cartKey = generateUniqueCartSessionRedisCacheKey(req.session.userID);
        const cart = await retrieveJSONObjectFromRedisCache(cartKey);
        var bookIds= [];
        var items = [];
    
        if(cart == null || cart == undefined || cart == {}){
            return res.json({
                "message":`No items in cart yet`
            });
        }
        

        for (let category in cart) {
            if (!cart.hasOwnProperty(category)) {
                continue;
            }
            if (!cart[category]) {
                continue;
            }
            if (Object.keys(cart[category]).length === 0) {
                continue;
            };
                
            for (let categoryItemID in cart[category]) {
                let oneCartItem = {
                    category: category,
                    id: categoryItemID,
                    qty: cart[category][categoryItemID]
                };
                if (category == "books"){
                    bookIds.push(categoryItemID);

                }
                items.push(oneCartItem);
            };
        }
        

        if (!Array.isArray(items)) {
            return res.status(400).json({ error: 'Invalid items array' });
        }

        req.session.cartItems = items;
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
                        unit_amount: Math.round(productDetails.price*100), // amount in cents
                    },
                    quantity: items[i].qty,

                
                };
                lineItems.push(product)
            }
            else {
                continue
            }
                    
        }
        
        //console.log(`Purcahse Items: \n\t: ${JSON.stringify(lineItems, null, 2)}`);
        
        let stripePaymentSession = await stripe.checkout.sessions.create({
            payment_method_types: ['card', 'klarna', 'alipay','us_bank_account'],
            line_items: lineItems,
            mode: 'payment',    
            shipping_address_collection: {'allowed_countries': ['US','CA']},
            customer_creation: 'always',
            success_url: `${process.env.WEBSITE_URL}/checkout/successPayment?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.WEBSITE_URL}/checkout`,
        })      
        //save the stripe payment intent session in the web session
        //let stpPaymentString = JSON.stringify(stripePaymentSession);
        //let stp = await JSON.parse(stpPaymentString); 
        //req.session.stripePaymentSession = stp;
        //save the shipping info in the web session
        //req.session.shippingInfo = shippingInfo;
        //req.session.lineItems = lineItems;
        req.session.stripePaymentSession = stripePaymentSession ;
        await req.session.save();
        res.json({ id: stripePaymentSession.id });
        
        //res.redirect(303, session.url);
        //console.log(`Stripe Payment Session Details Returned: \n\t: ${JSON.stringify(stripePaymentSession, null, 2)}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

const  successPayment = async(req,res)=>{
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

    let t = await sequelize.transaction();
    let orderToSendAsEmail = [];
    try{
        //get the customer email from stripe session
        //const stripePaymentSession = req.session.stripePaymentSession;
        //const shippingInfo = req.session.shippingInfo;
        
        const stripePaymentSession = await stripe.checkout.sessions.retrieve(req.query.session_id);
        const customerRetrieved = await stripe.customers.retrieve(stripePaymentSession.customer);

        //console.log(`Customer ${JSON.stringify(customerRetrieved, null, 2)}`);
        
        console.log(`Customer ${JSON.stringify(stripePaymentSession, null, 2)}`);

        //stripe session data should have been saved in the session
        //start transaction with sequelize
        //first attempt to retrieve the customer from the customerModel
        let customer ;
        const existingCustomer = await customerModel.findOne({ where: { email: customerRetrieved.email } });
        if (existingCustomer) {
            customer = existingCustomer;
        }  else {
            
            customer= await customerModel.create({
                first_name:customerRetrieved.name,
                last_name:customerRetrieved.name,
                email:customerRetrieved.email,
                password:"",
                street_address:customerRetrieved.shipping.address.line1,
                city:customerRetrieved.shipping.address.city,
                state_province:customerRetrieved.shipping.address.state,
                country:customerRetrieved.address.country,
                postal_zipcode:customerRetrieved.shipping.address.postal_code,
                phone:customerRetrieved.phone

            },
            {transaction:t});

        }
        //customer could already exist and they are shipping to a different customer address
        //so therefore use the address provided by stripe for this transaction
        let thisStripeShippingDetails = stripePaymentSession.shipping_details;
        const order = await orderModel.create({
            customer_id:  customer.customer_id, // Has to be changed to session.customer
            order_date: new Date(),
            total_amount: stripePaymentSession.amount_total / 100,
            payment_status: 'Pending',
            shipping_address: thisStripeShippingDetails.name + ' ' +  thisStripeShippingDetails.address.line1 + ' ' + thisStripeShippingDetails.address.line2,
            shipping_city: thisStripeShippingDetails.address.city,
            shipping_state_province: thisStripeShippingDetails.address.state,
            shipping_country: thisStripeShippingDetails.address.country,
            shipping_postal_code: thisStripeShippingDetails.address.postal_code,
            delivery_status: 'Processing'
        },
        {transaction:t});

        let items = req.session.cartItems;
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
                    
                },
                {transaction:t});

                productDetails.Inventory.quantity_available-=item.qty

                await productDetails.Inventory.save() ;
                orderToSendAsEmail.push({
                    title: productDetails.title,
                    quantity: item.qty,
                    price: productDetails.price,
                    subtotal: item.qty * productDetails.price
                });
            }
            else{
                continue
            }
        }
        const payments= await paymentModel.create({
            order_id: order.order_id,
            payment_date: new Date(),
            payment_method: stripePaymentSession.payment_method_types[0],
            amount: order.total_amount,
            transaction_id: stripePaymentSession.id
        },
        {transaction:t});
        await t.commit();
        //clear cart
        const cartKey = generateUniqueCartSessionRedisCacheKey(req.session.userID);
        await deleteDataFromRedisCache(cartKey);
        req.session.shippingInfo = null;
        req.session.lineItems = null;
        req.session.stripePaymentSession = null;
        await req.session.save();
        //send email to customer
        sendCustomerNewOrderEmailNotofication(order, orderToSendAsEmail, customer);
        customer = req.session.customer;
        return res.status(200).render("../checkout/pages/successPage",{
            pagetitle:"Payment Success",
            order:order,
            items:orderToSendAsEmail
        })
    }
    catch(err){
        console.log(err)
        await t.rollback();
        return res.status(500).redirect(`/checkout`)
    }

} ;

const showStripePublicKey = (req, res) => {
    /**
 * Sends the public key of the Stripe API in the response.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object used to send the public key in the response.
 * @return {void} - Returns the public key in the response.
 */
    res.json({ stripe_public_key: process.env.STRIPE_PUBLIC_KEY });
};


module.exports = {
    askShippingInfo,
    checkout,
    successPayment,
    showStripePublicKey
};
