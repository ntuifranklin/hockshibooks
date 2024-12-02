const {retrieveJSONObjectToRedisCache} = require('../middleware/redis');
const { LOGGED_IN_USER_VARIABLE_NAME } = require('../utilities/universal_web_constants');

const INDEX_ROUTE_NAME = "admin";
function adminRouteName() {
    return INDEX_ROUTE_NAME ;
} ;

async function isAdminUserIsLoggedInAndSavedInCache() {
    //the login function renders the login page that will request the email and password of the users who wishes to login
    let loggedInAdminUser = await retrieveJSONObjectToRedisCache(LOGGED_IN_USER_VARIABLE_NAME);
    console.log(`Verifying that admin user is logged in`);
    /* if admin user has been in cache for 15 minutes or
     more then they have to log back in */
    if (!loggedInAdminUser)
        return false ;
    if(!("unixEpoch" in Object.keys(loggedInAdminUser)))
        return false ;           
                   
    let loggedInUnixEpoch = loggedInUser.unixEpoch ;
    let currentUnixEpoch = Math.ceil((new Date())/1000)
    let f15teenMinutes = 900 ; //15 mins = 900 seconds

    if ((currentUnixEpoch - parseInt(loggedInUnixEpoch)) >= f15teenMinutes) 
            return false ;
            
    console.log(`Admin user is truthfuly logged in`);
    return true ;   

}

module.exports = {
    adminRouteName,
    isAdminUserIsLoggedInAndSavedInCache

}