//require dotenv
require("dotenv").config()

//check if node_env is production
function setStripeKeysToUse() {
    
    if(process.env.NODE_ENV==process.env.PRODUCTION_ENV){
        process.env.STRIPE_PUBLIC_KEY=process.env.PRODUCTION_STRIPE_PUBLIC_KEY
        process.env.STRIPE_SECRET_KEY=process.env.PRODUCTION_STRIPE_SECRET_KEY
    } else {
        process.env.STRIPE_PUBLIC_KEY=process.env.DEVELOPMENT_STRIPE_PUBLIC_KEY
        process.env.STRIPE_SECRET_KEY=process.env.DEVELOPMENT_STRIPE_SECRET_KEY
    } ;

}


exports.setStripeKeysToUse = setStripeKeysToUse;