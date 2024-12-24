
require('dotenv').config();
const stripe_private_key = process.env.STRIPE_SECRET_KEY;
const stripe = require('stripe')(`${stripe_private_key}`);

async function getListOfAcceptedStripePaymentMethods() {
    const paymentMethods = await stripe.paymentMethods.list();
    console.log(JSON.stringify(paymentMethods, null, 2));
    return paymentMethods.data;
} ;

module.exports = {

    getListOfAcceptedStripePaymentMethods
};