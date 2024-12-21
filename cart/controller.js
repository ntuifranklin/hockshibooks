const { USER_CART_NAME, ADD_CART_QUANTITY, SUBTRACT_CART_QUANTITY, REMOVE_CART_ITEM, QUANTITY } = require("../utilities/universal_web_constants");

const { 
    writeDataToRedisCache, 
    readDataFromRedisCache, 
    retrieveJSONObjectFromRedisCache, 
} = require('../middleware/redis');
const { Op } = require("sequelize");
const provinceStateModel = require("../models/provinceStateModel");
const CountryModel = require("../models/countryModel");
const bookModel = require("../models/bookModel") ;
const inventoryModel = require("../models/inventory");
const { generateUniqueCartSessionRedisCacheKey } = require("./utilities");
let customer ;
const viewCart= async(req,res)=>{
    /**
 * Renders the cart page view.
 *
 * @param {Object} req - The req object.
 * @param {Object} res - The response object used to render the cart page view.
 * @return {Promise<void>} - Returns a Promise that resolves with the rendered cart page view.
 */
    
    const states=await provinceStateModel.findAll()
    const country=await CountryModel.findAll()

    customer = req.session.customer;    

    return res.render("../cart/pages/viewCart",{
        pagetitle:"Your Shopping Cart",
        cartPage:true,
        states:states,
        country:country,
        customer:customer
    })
}
const getCartItems=async (req,res)=>{
    /**
 * Retrieves the detailed cart items based on the provided cart items.
 *
 * @param {object} req - The request object containing the cart items in the body.
 * @param {object} res - The response object to send the detailed cart items.
 * @return {object[]} An array of detailed cart items with book information and quantity.
 */
    try {

    
        const cartKey = generateUniqueCartSessionRedisCacheKey(req.session.userID);
        const cart = await retrieveJSONObjectFromRedisCache(cartKey);
        var bookIds= [];
        var cartItems = [];
    
        if(cart == null){
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
                cartItems.push(oneCartItem);
            };
        }
        
        const books= await bookModel.findAll({
            where :{
                book_id:{
                    [Op.in]:bookIds
                }
            },
            include:[{
                model:inventoryModel
            }]
        })

        const detailedcartItems=books.map(book=>{
            let imgUrl=""
            if(book.cover_image_url.split(":")[0]!="https"){
                imgUrl=`../uploads/${book.cover_image_url}`
            }else{
                imgUrl=`${book.cover_image_url}`
            }
            const cartItem=cartItems.find(item=>item.id==book.book_id)
            return{
                ...book.dataValues,
                cover_image: imgUrl,
                qty:cartItem.qty
            }
        }) ;
        return res.json(detailedcartItems);
        
    } catch (error) {
        console.error('Error fetching cart items:', error);
        res.status(500).json({ error: 'Internal Server Error' });
        
    }
} ;
const updateCartInRedisSessionCache = async (req, res) => {
    const { action, productIDToUpdate, category } = req.body;
    const userID = req.session.userID;
    /* 
        Do not add userID to the cartKey below else
         redis will not save to cache.
    */
    const cartKey = generateUniqueCartSessionRedisCacheKey(userID);
    //const cartKey = cartRequestCategoryToKey(req, category);
    //console.log(`Cart Key: ${cartKey}`);
    let cart = {};
    try {
        const existingCart = await retrieveJSONObjectFromRedisCache(cartKey);
        //console.log(`Existing Cart: ${existingCart}`);
        if (existingCart) {
            cart = await JSON.parse(JSON.stringify(existingCart));
        } ;
        console.log(`Exisiting Cart: ${JSON.stringify(cart)}`);
        
        if (typeof cart[category] == "undefined") {
            cart[category] = {};
        }
        
        if (typeof cart[category][productIDToUpdate] == "undefined") {
            cart[category][productIDToUpdate] = 0;
        } ;
        const existingQuantity = cart[category][productIDToUpdate];

        var oldQuantity = existingQuantity ? parseInt(existingQuantity) : 0;
        var newQuantity;

        const addQuantity = ADD_CART_QUANTITY;
        const subtractQuantity = SUBTRACT_CART_QUANTITY;
        const removeItem = REMOVE_CART_ITEM;
        const validActions = [addQuantity, subtractQuantity, removeItem];

        if (!validActions.includes(action)) {
            console.log(`Invalid action: ${action}`);
            return res.status(400).send({ message: 'error', responseText: 'Invalid action' });
        }

        const options = {
            EX: 3600, // 3600 is 1h , while 43200 is 12h
            //XX: true, // write the data even if the key already exists
        };

        if (action == subtractQuantity) {
            if (oldQuantity < 1) {
                console.log('Item not in wish list');
                return res.status(400).send({ message: 'error', responseText: 'Item not in wish list' });
            } else if (oldQuantity == 1) {
                delete cart[category][productIDToUpdate] ;
                let sc = JSON.stringify(cart);
                //cart = await JSON.parse(sc);
                await writeDataToRedisCache(cartKey, sc, options);
                console.log('Item removed from cart');
                return res.status(200).send({ message: 'success', responseText: 'Item removed from cart' });
            } else {
                newQuantity = oldQuantity - 1;
                cart[category][productIDToUpdate] = newQuantity;
                await writeDataToRedisCache(cartKey, JSON.stringify(cart), options);
                console.log(`Item quantity decreased: ${newQuantity}`);
                return res.status(200).send({ message: 'success', responseText: `Item quantity reduced to ${newQuantity} in wishlist` });
            }
        } else if(action == removeItem) {
            delete cart[category][productIDToUpdate] ;
            //cart[category] = {} ;
            let sc = JSON.stringify(cart);
            //cart = await JSON.parse(sc);
            await writeDataToRedisCache(cartKey, sc, options);
            console.log(`Item removed from cart, with action ${removeItem}`);
            return res.status(200).send({ message: 'success', responseText: 'Item removed from cart' });

        } else if (action == addQuantity) {
            newQuantity = oldQuantity + 1;
            cart[category][productIDToUpdate] = newQuantity;
            await writeDataToRedisCache(cartKey, JSON.stringify(cart), options);
            //await writeDataToRedisCache(cartKey, newQuantity, options);
            //console.log(`Item quantity increased: ${newQuantity}`);

            var responseText = "";
            if (newQuantity == 1) {
                responseText = "Item added to cart successfully";
            } else {
                responseText = `Item quantity in cart increased to ${newQuantity}`;
            }

            let newUpdate = await readDataFromRedisCache(cartKey);
            console.log(`Updated saved cart: ${JSON.stringify(newUpdate,null, 2)}`);
            return res.status(200).send({ message: 'success', responseText: responseText });
        } else {
            console.log('Invalid action');
            return res.status(400).send({ message: 'error', responseText: 'Invalid action' });
        };
    } catch (error) {
        console.error('Error updating cart in Redis:', error);
        return res.status(500).send({ message: 'error', responseText: 'Internal Server Error' });
    }
};

module.exports = {
    getCartItems,
    viewCart,
    updateCartInRedisSessionCache
}