require('dotenv').config();
const stripe_private_key = process.env.STRIPE_PRIVATE_KEY ;
const stripe = require('stripe')(`${stripe_private_key}`);
exports.stripe = stripe ;
/*
stripe.products.create({
  name: 'Starter Subscription',
  description: '$12/Month subscription',
}).then(product => {
  stripe.prices.create({
    unit_amount: 1200,
    currency: 'usd',
    recurring: {
      interval: 'month',
    },
    product: product.id,
  }).then(price => {
    console.log('Success! Here is your starter subscription product id: ' + product.id);
    console.log('Success! Here is your starter subscription price id: ' + price.id);
  });
});
*/

async function testStripeProductCreation() {
  return stripe.products.create({
    name: 'HockShi Startet Subscription',
    description: '$11/Month subscription',
  }) ;
} ;
exports.testStripeProductCreation = testStripeProductCreation ;
