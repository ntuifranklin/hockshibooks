const {LOGGED_IN_CUSTOMER_VARIABLE_NAME} = require('../utilities/universal_web_constants'); 
const {retrieveJSONObjectFromRedisCache} = require('../middleware/redis');
function generateLoggedInCustomerCacheKey(sessionUserID){
    return `${LOGGED_IN_CUSTOMER_VARIABLE_NAME}:${sessionUserID}`;
};

async function setResponseLocalsCustomer(request, response, next){

    if (request.session.userID == undefined) {
        
        return next();
    } else if (response.locals.customer == undefined || response.locals.customer == null) {
        let userID = request.session.userID;
        let loggedInCustomerCacheKey = generateLoggedInCustomerCacheKey(userID);
        let loggedInCustomer = await retrieveJSONObjectFromRedisCache(loggedInCustomerCacheKey);
        response.locals.customer = loggedInCustomer;
        return next();
    } else {
        return next();
    }
    
}

module.exports = {
    generateLoggedInCustomerCacheKey,
    setResponseLocalsCustomer

}