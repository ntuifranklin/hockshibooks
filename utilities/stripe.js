require('dotenv').config();
//const stripe_private_key = process.env.STRIPE_SECRET_KEY ;
const stripe_test_private_key = "sk_test_51Or8CFA8wUPGzCHgOqhMp29nbE5Q8MtHOEjCPTJgAlPw7UFWx4jj9WmnC2lFLAjXW3cXGjF2wZEzRtORdO3ibzqG00hvTJiwis";
const stripe = require('stripe')(`${stripe_test_private_key}`);
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
