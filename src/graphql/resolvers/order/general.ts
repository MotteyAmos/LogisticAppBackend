import OrderModel from "../../../database/models/orders/orderModule"


export const orderResolvers ={

    Query:{
        orders: async()=>{
            const orders = await OrderModel.find({})
            return orders
        },

        order:async (_:any, {id}:{id:String})=>{
            const order = await OrderModel.findOne({_id:id});
            return order;
        }
    }
}