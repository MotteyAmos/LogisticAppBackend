import { model, Schema } from "mongoose";
import { IOrder } from "../../../rest-api/types/orders/general";
import { OrderSource, orderStatus } from "../../../rest-api/enum/orders";

const OrderSchema: Schema<IOrder> = new Schema<IOrder>({
  orderDate: {
    type: Date,
    default: Date.now,
  },
  orderId: {
    type: String,
    required: true,
    unique: true,
    index:true
  },
  destination: {
    type: String,
    required: true,
  },
 productDescription: {
    type: String,
    required: true,
  },
  location: {
    lat: { type: Number },
    lng: { type: Number },
  },
  recipientName: {
    type: String,
    required: true,
  },
  recipientNumber: {
    type: String,
    required: true,
  },
  paymentAmount: {
    type: Number,
    required: true,
  },
  deliveryFee: {
    type: Number,
    default:0
  },
  status: {
    type: String,
    enum: Object.values(orderStatus),
    default: orderStatus.PENDING,
  },
  source:{
    type: {
       type:   String,
       enum : Object.values(OrderSource),
       required:true
    },
    vendorID:{
        type:Schema.Types.ObjectId,
        ref:"Vendor"
    }
  },
  assignedTo: new Schema({
    type:{
      type:String
    },
    entityAssignedId:{
      type:Schema.Types.ObjectId
    }
  },{_id:false}) ,
  deliveryDate: {
    type: Date,
  },
  productImage: {
    type: String,
  },
  rejectedReasons:{
    type:String
  }
}, { timestamps: true });


const OrderModel = model<IOrder>("Order", OrderSchema);


export default OrderModel;