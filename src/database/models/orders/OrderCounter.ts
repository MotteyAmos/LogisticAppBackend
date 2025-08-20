import mongoose from "mongoose";



const orderCounterSchema = new mongoose.Schema({
    vendorId:{
        type:mongoose.Schema.Types.ObjectId,

    },
    initials:{
        type:String
    },
    lastOrderCounter:{
        type:Number,
        default:0
    },
    source:{
        type:String
    }
})


const OrderCounterModel = mongoose.model("OrderCounter", orderCounterSchema)

export default OrderCounterModel;