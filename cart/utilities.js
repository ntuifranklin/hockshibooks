const {USER_CART_NAME} = require('../utilities/universal_web_constants');

const generateUniqueCartSessionRedisCacheKey = (sessionUserID) => {
  return `${sessionUserID}:${USER_CART_NAME}`;
};


module.exports = {
    generateUniqueCartSessionRedisCacheKey
};