import mongoose from "mongoose";

const orderIdPoolSchema = new mongoose.Schema({
  orderId: {
     type: String, 
    unique:true
   },
  assigned:{
    type:Boolean,
    default:false
  }
 
});

export const OrderIdPoolModel = mongoose.model("OrderIdPool", orderIdPoolSchema);