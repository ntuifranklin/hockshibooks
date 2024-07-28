const OrderModel=require("../models/ordersModel")
const OrderItemsModel=require("../models/orderItemsModel")
const customerModel=require("../models/customerModel")
const BooksModel=require("../models/bookModel")
const {sendStatusChangedMessage}= require("../utilities/functions")

let order;
const viewOrder=async(req,res)=>{
    try{
        const id= req.params.id;

         order=await OrderModel.findOne({
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
        // for(const orderi of orderItems){

        //     console.log(orderi.Book)
        // }
        return res.status(200).render("pages/orders/viewOrders",{
            order:order,
            orderI:orderItems
        })


    }
    catch(e){
        return res.status(500).redirect(`${process.env.HOST}/admin/dashboard?msg=a+Problem+occured&type=danger`);

    }

}

const changeToProcessing= async(req,res)=>{
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
            sendStatusChangedMessage(order,"processing")
        return res.status(200).redirect(`${process.env.HOST}/admin/dashboard?msg=status+successfully+changed+to+Processing&type=success`);

           
        }
        else{
        return res.status(500).redirect(`${process.env.HOST}/admin/dashboard?msg=a+Problem+occured&type=danger`);


        }
        
        // for(const orderi of orderItems){

        //     console.log(orderi.Book)
        // }



    }
    catch(e){
        return res.status(500).redirect(`${process.env.HOST}/admin/dashboard?msg=a+Problem+occured&type=danger`);
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
            sendStatusChangedMessage(order,"shipped")

        return res.status(200).redirect(`${process.env.HOST}/admin/dashboard?msg=status+successfully+changed+to+shipped&type=success`);

           
        }
        else{
        return res.status(500).redirect(`${process.env.HOST}/admin/dashboard?msg=a+Problem+occured&type=danger`);


        }
    }
    catch(e){
        return res.status(500).redirect(`${process.env.HOST}/admin/dashboard?msg=a+Problem+occured&type=danger`);
    }
}

const changeToDelivered =async(req,res)=>{
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
            sendStatusChangedMessage(order,"delivered")

        return res.status(200).redirect(`${process.env.HOST}/admin/dashboard?msg=status+successfully+changed+to+delivered&type=success`);

           
        }
        else{
        return res.status(500).redirect(`${process.env.HOST}/admin/dashboard?msg=a+Problem+occured&type=danger`);


        }
    }
    catch(e){
        return res.status(500).redirect(`${process.env.HOST}/admin/dashboard?msg=a+Problem+occured&type=danger`);
    }
}

module.exports={viewOrder,changeToDelivered,changeToProcessing,changeToShipped}