const {retrieveJSONObjectFromRedisCache} = require('../middleware/redis');
const { LOGGED_IN_USER_VARIABLE_NAME } = require('../utilities/universal_web_constants');

const INDEX_ROUTE_NAME = "admin";
function adminRouteName() {
    return INDEX_ROUTE_NAME ;
} ;

async function isAdminUserIsLoggedInAndSavedInCache() {
    //the login function renders the login page that will request the email and password of the users who wishes to login
    var loggedInAdminUser = await retrieveJSONObjectFromRedisCache(LOGGED_IN_USER_VARIABLE_NAME);
    var stringifiedAdminUser = JSON.stringify(loggedInAdminUser);
    loggedInAdminUser = await JSON.parse(stringifiedAdminUser);
    //console.log(`Verifying that admin user is logged in`);
    /* if admin user has been in cache for 15 minutes or
     more then they have to log back in */
    //console.log(`user found in ${__filename} : ${JSON.stringify(loggedInAdminUser)}`);
    if (loggedInAdminUser == null)
        return false ;
    //console.log(`null passed`);
    if (!loggedInAdminUser)
        return false ;
    //console.log(`!not object passed`);
    if(loggedInAdminUser["loggedInTime"] == undefined)
        return false ;           
    console.log(`loggedInTime key found passed`);               
    let loggedInUnixEpoch = loggedInUser["loggedInTime"] ;
    let currentUnixEpoch = Math.ceil((new Date())/1000)
    let f15teenMinutes = 900 ; //15 mins = 900 seconds
    console.log(`current unix epoch: ${currentUnixEpoch}`);
    if ((currentUnixEpoch - parseInt(loggedInUnixEpoch)) >= f15teenMinutes) 
            return false ;
            
    console.log(`Admin user is truthfuly logged in`);
    return true ;   

}

module.exports = {
    adminRouteName,
    isAdminUserIsLoggedInAndSavedInCache

}