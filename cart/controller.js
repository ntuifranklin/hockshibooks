const { USER_CART_NAME, ADD_CART_QUANTITY, SUBTRACT_CART_QUANTITY, REMOVE_CART_ITEM, QUANTITY } = require("../utilities/universal_web_constants");

const {retrieveJSONObjectFromRedisCache, saveJSONObjectToRedisCache, REDIS_DEFAULT_CACHING_OPTIONS} = require('../middleware/redis');
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


    return res.render("pages/cart",{
        states:states,
        country:country
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
        const cartItems= req.body.cartItems
    const bookIds= cartItems.map(item=> item.id)

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
    })

    res.json(detailedcartItems);
        
    } catch (error) {
        console.error('Error fetching cart items:', error);
        res.status(500).json({ error: 'Internal Server Error' });
        
    }
} ;

const updateCartInRedisSessionCache=async(req, res)=>{
    
    var userCart = await retrieveJSONObjectFromRedisCache(USER_CART_NAME);
    
    userCart = await JSON.parse(JSON.stringify(userCart));
    console.log(`\n\n\ncart discovered in cart controller: ${JSON.stringify(userCart, null, 2)}`);
    if (userCart === null)
        userCart = {} ;
    console.log(`\n\n\ncart could be null: ${JSON.stringify(userCart, null, 2)}`);
    
    const {action,productIDToUpdate, category} = req.body;
    //console.log(action,productIDToUpdate, category);
    const addQuantity = ADD_CART_QUANTITY;
    const subtractQuantity = SUBTRACT_CART_QUANTITY;
    const removeItem = REMOVE_CART_ITEM;
    const validActions = [addQuantity, subtractQuantity, removeItem];
   
    
    

    if (!validActions.includes(action)) {
        return res.status(400).send({ message: 'error', responseText: 'Invalid action' });
   
    } ;
    
    if (userCart[category] == undefined) {
        userCart[category] = {}; 
        console.log(`category: ${category} not found`);
    } ;
    
    if (userCart[category][productIDToUpdate] == undefined) {
        console.log(`productID: ${productIDToUpdate} not found`);
        userCart[category][productIDToUpdate] = {
            
        } ; 
       
    } ;
    
    if (userCart[category][productIDToUpdate][QUANTITY] == undefined) {
        console.log(`quantity: ${QUANTITY} not found`);
        userCart[category][productIDToUpdate][QUANTITY] = 0;
        
    } ;
    
    
    const options = 
    {
        
        EX: 3600, // 3600 is 1h , while 43200 is 12h
        NX: true, // write the data even if the key already exists
    } ;
     ;
    
    
    const key = USER_CART_NAME;
    
    var oldQuantity = parseInt(userCart[category][productIDToUpdate][QUANTITY]) ;
    /* update quantity and save session */
    if (action == subtractQuantity) {
        if ( oldQuantity < 1 ) {
            res.status(400).send({ message: 'error', responseText: 'Item not in wish list' });
            
        } else if ( oldQuantity == 1) {
            delete   userCart[category][productIDToUpdate];
            
            userCart = await JSON.parse(JSON.stringify(userCart));
            //console.log(`Item removed from cart controller: ${JSON.stringify(userCart, null, 2)}`);
            await saveJSONObjectToRedisCache(key, userCart, options);
            
            
            req.locals.USER_CART = userCart ;
            res.status(200).send({ message: 'success', responseText: 'Item removed from wish list' });
          
        } else {
            let newQuantity = oldQuantity - 1 ;
            userCart[category][productIDToUpdate][QUANTITY] = newQuantity;
            userCart = await JSON.parse(JSON.stringify(userCart));
            //console.log(`Item quantity decreased in cart controller: ${JSON.stringify(userCart, null, 2)}`);
            await saveJSONObjectToRedisCache(key, userCart, options);
            
            req.locals.USER_CART = userCart ;
            res.status(200).send({ message: 'success', responseText: `Item quantity reduced to ${JSON.parse(JSON.stringify(userCart[productIDToUpdate][QUANTITY]))} in wishlist` });
        }
    
    } else {
        
        
        console.log(`Old quantity : ${oldQuantity}`);
        var newQuantity = oldQuantity + 1;
        console.log(`New quantity : ${newQuantity}`);
        userCart[category][productIDToUpdate][QUANTITY] = newQuantity;
        
        console.log(`New value of cart to be updated : addition in : ${JSON.stringify(userCart, null, 2)}`);
        await saveJSONObjectToRedisCache(key, userCart, options);
        var responseText = "";
        if ( userCart[category][productIDToUpdate][QUANTITY] == 1) {
            //console.log(`Item added to cart in cart controller: ${JSON.stringify(userCart, null, 2)}`);
            responseText="Item added to wish list" ;
        } else {
            //console.log(`Item quantity increased in cart controller: ${JSON.stringify(userCart, null, 2)}`);
            responseText=`Item quantity increased to ${ userCart[category][productIDToUpdate][QUANTITY]}` ;
        } ;
        
        req.locals.USER_CART = userCart ;
        res.status(200).send({ message: 'success', responseText: responseText });
    };
}


module.exports = {
    getCartItems,
    viewCart,
    updateCartInRedisSessionCache
}