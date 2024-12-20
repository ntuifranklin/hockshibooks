const OrderModel=require("../models/ordersModel")
const OrderItemsModel=require("../models/orderItemsModel")
const OrderItem = require("../models/orderItemsModel");
const customerModel=require("../models/customerModel")
const BooksModel=require("../models/bookModel")
const {sendStatusChangedMessage}= require("../utilities/functions")
const {
    
    ORDER_STATUS_SHIPPED,
    ORDER_STATUS_PROCESSING,
    ORDER_STATUS_DELIVERED
}=require("../utilities/universal_web_constants")

let order;
const viewOrder=async(req,res)=>{
    /**
 * Retrieves an order and its associated order items from the database and renders a view to display them.
 *
 * @param {Object} req - The request object containing the order ID in the parameters.
 * @param {Object} res - The response object used to render the view or redirect to an error page.
 * @return {Promise<void>} - Returns a Promise that resolves with the rendered view or redirects to an error page.
 */
    try{
        const id= req.params.id;

         let order=await OrderModel.findOne({
            where:{
                order_id:id
            },
            include:[
                {model:customerModel}
            ]
        })
        const orderItems= await OrderItemsModel.findAll({
            where:{
                order_id:id
            }
            ,include:[
                {model:BooksModel}
            ]
        })
        let user = req.session.user; ;
        return res.status(200).render("../orders/pages/viewOrderByAdmin",{
            order:order,
            orderI:orderItems,
            user:user
        })


    }
    catch(e){
        return res.status(500).redirect(`/admin/dashboard?msg=a+Problem+occured&type=danger`);

    }

}

const changeToProcessing= async(req,res)=>{
    /**
 * Updates the delivery status of an order to "Processing" and saves the changes to the database.
 * Sends a status change message to the appropriate channel.
 * Redirects to the admin dashboard with a success or error message.
 *
 * @param {Object} req - The request object containing the order ID in the parameters.
 * @param {Object} res - The response object used to redirect to the admin dashboard.
 * @return {Promise<void>} - Returns a Promise that resolves with a redirect to the admin dashboard.
 */
    try{
        const id= req.params.id;

        const order=await OrderModel.findOne({
            where:{
                order_id:id
            }
            
        })
        if(order.delivery_status!=="Processing"){

            order.delivery_status="Processing"
            await order.save()
            sendStatusChangedMessage(order,ORDER_STATUS_PROCESSING)
            return res.status(200).redirect(`/admin/dashboard?msg=status+successfully+changed+to+Processing&type=success`);
           
        } else {
            return res.status(500).redirect(`/admin/dashboard?msg=a+Problem+occured&type=danger`);

        }
    } catch(e) {
        return res.status(500).redirect(`/admin/dashboard?msg=a+Problem+occured&type=danger`);
    }
    

}

const changeToShipped = async(req,res)=>{
    try{
        const id= req.params.id;

        const order=await OrderModel.findOne({
            where:{
                order_id:id
            }
            
        })

        if(order.delivery_status!=="Shipped"){

            order.delivery_status="Shipped"
            await order.save()
            sendStatusChangedMessage(order,ORDER_STATUS_SHIPPED)

            return res.status(200).redirect(`/admin/dashboard?msg=status+successfully+changed+to+shipped&type=success`);
           
        } else {
            return res.status(500).redirect(`/admin/dashboard?msg=a+Problem+occured&type=danger`);

        }
    }
    catch(e){
        return res.status(500).redirect(`/admin/dashboard?msg=a+Problem+occured&type=danger`);
    }
}

const changeToDelivered =async(req,res)=>{
    /**
 * Updates the delivery status of an order to "Shipped" and sends a status changed message.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @return {Promise<void>} Redirects the user to the admin dashboard with a success or error message.
 */
    try{
        const id= req.params.id;

        const order=await OrderModel.findOne({
            where:{
                order_id:id
            }
        })

        if(order.delivery_status!=="Delivered"){

            order.delivery_status="Delivered"
            await order.save()
            sendStatusChangedMessage(order,ORDER_STATUS_DELIVERED)

        return res.status(200).redirect(`/admin/dashboard?msg=status+successfully+changed+to+delivered&type=success`);

           
        }
        else{
        return res.status(500).redirect(`/admin/dashboard?msg=a+Problem+occured&type=danger`);


        }
    }
    catch(e){
        return res.status(500).redirect(`/admin/dashboard?msg=a+Problem+occured&type=danger`);
    }
}


const orderDetail= async(req,res)=>{
    
    try{

    
        const orderId=req.params.id
        const Order=await OrderModel.findOne({
            where:[
                {
                    order_id:orderId
                }
            ]
        })
        const orderItems= await OrderItem.findAll({
            where:[
                {order_id:orderId}
            ],
            include:[
                {model:BooksModel}
            ]
        })
        //console.log(orderItems)
        return res.render("../orders/pages/orderDetail",{
            order:Order,
            orderItems:orderItems

        })
    }
    catch(e){
        return res.redirect(`/customer/login`)

    }
      



}
;
module.exports={
    viewOrder,
    changeToDelivered,
    changeToProcessing,
    changeToShipped,
    orderDetail
}