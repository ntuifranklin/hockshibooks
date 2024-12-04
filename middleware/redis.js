require('dotenv').config();
const hash = require("object-hash");
const crypto = require('crypto');

const Redis = require('ioredis');
/*
const {RedisStore} = require('connect-redis');
const {createClient} = require('redis');
*/
const { LOGGED_IN_USER_VARIABLE_NAME, USER_CART_NAME, WEBSITE_USER } = require("../utilities/universal_web_constants");


let REDIS_CONNECTION_OPTIONS = {
	host: process.env.REDIS_HOST,
	port: process.env.REDIS_PORT,
	db: process.env.REDIS_DB_INDEX,
    prefix: process.env.REDIS_PREFIX,
    ttl: process.env.REDIS_TTL
};
exports.REDIS_CONNECTION_OPTIONS = REDIS_CONNECTION_OPTIONS;

let redisClient = undefined;
exports.redisClient = redisClient ;


/*
const REDIS_CACHING_OPTIONS = 
{
    EX, // the specified expire time in seconds
    PX, // the specified expire time in milliseconds
    EXAT, // the specified Unix time at which the key will expire, in seconds
    PXAT, // the specified Unix time at which the key will expire, in milliseconds
    NX, // write the data only if the key does not already exist
    XX, // write the data only if the key already exists
    KEEPTTL, // retain the TTL associated with the key
    GET, // return the old string stored at key, or "undefined" if key did not exist
}
*/

const REDIS_DEFAULT_CACHING_OPTIONS = 
{
    EX: 3600, // 3600 is 1h , while 43200 is 12h
    //NX: 'NX', // write the data even if the key already exists
} ;

exports.REDIS_DEFAULT_CACHING_OPTIONS = REDIS_DEFAULT_CACHING_OPTIONS;

async function initializeRedisClient() {
    
    try {
        redisClient = new Redis(REDIS_CONNECTION_OPTIONS); 
        // connect to the Redis server
        //await redisClient.connect();
        console.log(`Connected to Redis successfully!`);
        //return redisClient;
      } catch (e) {
        console.error(`Failed to create the Redis client with error:`);
        console.error(e);
        console.log(`Redis connection options: ${JSON.stringify(REDIS_CONNECTION_OPTIONS)}`);
      } ;
} ;

exports.initializeRedisClient = initializeRedisClient ;

async function clearRedisClientDB(){
    if (isRedisWorking()){
        // Clear the current database
        redisClient.flushdb((err, succeeded) => {
            if (err) {
            console.error('Error clearing Redis cache:', err);
            } else {
            console.log('Redis cache cleared successfully:', succeeded);
            }
        });
        
        // Clear all databases
        redisClient.flushall((err, succeeded) => {
            if (err) {
            console.error('Error clearing all Redis databases:', err);
            } else {
            console.log('All Redis databases cleared successfully:', succeeded);
            }
        });
    }
}
exports.clearRedisClientDB = clearRedisClientDB ;

function requestToKey(request) {
// build a custom object to use as part of the Redis key
const reqDataToHash = {
    query: request.query,
    body: request.body,
};

// `${req.path}@...` to make it easier to find
// keys on a Redis client
return `${request.path}@${hash.sha1(reqDataToHash)}`;
} ;

/* 
    Takes a request,
    a category,
    the product ID within the category and 
    generates a unique hash for that combination.
 */
function cartRequestCategoryToKey(request, category) {
    // build a custom object to use as part of the Redis key
    const catProdDataToHash = {
        category : category
    };
    
    // `${req.path}@...` to make it easier to find
    // keys on a Redis client
    return `${request.originalUrl}@${hash.sha1(catProdDataToHash)}`;
} ;
exports.cartRequestCategoryToKey = cartRequestCategoryToKey ;
function userRequestToKey(request, userID) {
    // build a custom object to use as part of the Redis key
    const reqDataToHash = {
        query: request.query,
        body: request.body,
        userID: userID
    };

    // `${req.path}@...` to make it easier to find
    // keys on a Redis client
    return `${request.path}@${hash.sha1(reqDataToHash)}`;
} ;
exports.userRequestToKey = userRequestToKey ;
function isRedisWorking() {
// verify wheter there is an active connection
// to a Redis server or not
return !!redisClient?.isOpen;
}

exports.isRedisWorking = isRedisWorking ;

async function writeDataToRedisCache(key, data, options=REDIS_DEFAULT_CACHING_OPTIONS) {
    if (isRedisWorking()) {
        try {
        
            await redisClient.set(key, data, options);
            //console.log(`Writing at [${__filename}] data : ${data} to Redis`);
        } catch (e) {
            console.error(`Failed to cache data for key=${key}`, e);
        };
    };
}  ;

exports.writeDataToRedisCache = writeDataToRedisCache ;

async function readDataFromRedisCache(key) {
let cachedValue = undefined;

    if (isRedisWorking()) {
        // try to get the cached response from redis
        //console.log(`Redis attempting to read key : ${key}`);
        cachedValue = await redisClient.get(key);
        if (cachedValue != null ) {
            //console.log(`Redis returning value for key : `);
            //console.log(JSON.stringify(cachedValue, null, 2));
            return cachedValue;
        }
    } ;
    return null;
};
exports.readDataFromRedisCache = readDataFromRedisCache;

async function deleteDataFromRedisCache(key) {  
    
    if (isRedisWorking()) {
        // try to get the cached response from redis
        redisClient.del(key, function (err, reply) {
            if (!err)
                console.log(`Redis Deletion of key: ${key} successful with reply: ${reply}`);
        });
       
    }
}
    
exports.deleteDataFromRedisCache = deleteDataFromRedisCache;


/* Function below takes a json object then stringifies
and stores it as a string in the redis cache
*/
async function saveJSONObjectToRedisCache(key, jsonObject, options=REDIS_DEFAULT_CACHING_OPTIONS) {
    if (isRedisWorking()) {
        const stringifiedJsonObject = JSON.stringify(jsonObject) ;
        try {
            // write data to the Redis cache
            //var d = JSON.stringify(data);
            await redisClient.set(key, stringifiedJsonObject, options);
            //console.log(`saveJSONObjectToRedisCache: [${__filename}]  on writing data : ${stringifiedJsonObject} to Redis`);
            
        } catch (e) {
            console.error(`Failed to cache data for key=${key}`, e);
        }
    }
} ;
exports.saveJSONObjectToRedisCache = saveJSONObjectToRedisCache ;

/* Function below takes a json object then stringifies
and stores it as a string in the redis cache
*/
async function retrieveJSONObjectFromRedisCache(key) {
    if (isRedisWorking()) {
        
        try {
            // write data to the Redis cache
            //var d = JSON.stringify(data);
            
            const stringData = await redisClient.get(key);
            if (stringData == null)
                return null ;
            const jsonObject = await JSON.parse(stringData);
            //console.log(`retrieveJSONObjectFromRedisCache: [${__filename}] retrieving data : ${stringData} from Redis`);
            return jsonObject ;
            
        } catch (e) {
            console.error(`Failed to read stringed data for key=${key}`, e);
            
        } ;
        return null ;
    }
} ;
exports.retrieveJSONObjectFromRedisCache = retrieveJSONObjectFromRedisCache ;

function redisCacheMiddleware( options = REDIS_DEFAULT_CACHING_OPTIONS) {
return async (request, response, next) => {
    if (isRedisWorking()) {
        const key = requestToKey(request);
        // if there is some cached data, retrieve it and return it
        const cachedValue = await readDataFromRedisCache(key);
        if (cachedValue) {
            try {
            // if it is JSON data, then return it
            return response.json(JSON.parse(cachedValue));
            } catch {
            // if it is not JSON data, then return it
            return response.send(cachedValue);
            }
        } else {
            // override how res.send behaves
            // to introduce the caching logic
            const oldSend = response.send;
            response.send = function (data) {
            // set the function back to avoid the 'double-send' effect
            response.send = oldSend;

            // cache the response only if it is successful
            if (response.statusCode.toString().startsWith("2")) {
                writeDataToRedisCache(key, data, options).then();
            }

            return response.send(data);
            };

            // continue to the controller function
            next();
        }
    } else {
    // proceed with no caching
        next();
    }
};
} ;

exports.redisCacheMiddleware = redisCacheMiddleware ;


async function setRedisUserCartCacheMiddleware (request, response, next) {
        if (isRedisWorking()) {

            const key = USER_CART_NAME;
            // if there is some cached data, retrieve it and return it
            var cachedValue = await  retrieveJSONObjectFromRedisCache(key);
            if (cachedValue != null) {               
                request.locals.USER_CART = cachedValue ;
            } ;
            //console.log(`Current Cart content: ${JSON.stringify(cachedValue)}`);
            
        } 
        // proceed with no caching
        next();
};
exports.setRedisUserCartCacheMiddleware = setRedisUserCartCacheMiddleware ;

async function setRedisLoggedInUserCacheMiddleware (request, response, next) {
    //console.log(`checking keys in request :  ${JSON.stringify(Object.keys(request))}`)
    if (isRedisWorking()) {

        // the variable name used to store the user's cart information
        const key = LOGGED_IN_USER_VARIABLE_NAME;
        // if there is some cached data, retrieve it and return it
        var cachedValue = await retrieveJSONObjectFromRedisCache(key);
        if (cachedValue == null ) {
            
            const USER_REDIS_CACHING_OPTIONS = 
            {
                
                EX: process.env.ADMIN_USER_EXPIRE_TIME, // 15 minutes. User has to log in every 15 minutes
                NX: true, // write the data even if the key already exists
            } ;
            cachedValue = {};
            await saveJSONObjectToRedisCache(key, cachedValue, USER_REDIS_CACHING_OPTIONS);
            //request.locals.USER = cachedValue ;
        } ;
        request.locals.USER = cachedValue ;
        
    } 
    // proceed with no caching
    next();
    
};

exports.setRedisLoggedInUserCacheMiddleware = setRedisLoggedInUserCacheMiddleware ;


async function checkIfKeyExistsInRedisCache(key) {
    if (isRedisWorking()) {
        try {
            const exists = await redisClient.exists(key);
            if (exists) {
                return true;
            };
        } catch (e) {
            console.error(`Failed to check if key exists in Redis cache for key=${key}`, e);
        }
    }
    return false;
} ;
exports.checkIfKeyExistsInRedisCache = checkIfKeyExistsInRedisCache ;

async function createUniqueUserRedisKey(length=8){

    let unicityAccomplished = false;
    while (!unicityAccomplished) {
        let key = crypto.randomBytes(8).toString('hex').slice(0, length);
        let uniqueUserRedisKey = `${WEBSITE_USER}:${key}`;
        unicityAccomplished = await checkIfKeyExistsInRedisCache(uniqueUserRedisKey);
        if (unicityAccomplished) {
            return uniqueUserRedisKey;
        }
    };

} ;
exports.createUniqueUserRedisKey = createUniqueUserRedisKey ;