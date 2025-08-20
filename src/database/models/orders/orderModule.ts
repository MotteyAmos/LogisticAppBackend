import { model, Schema } from "mongoose";
import { IOrder } from "../../../rest-api/types/orders/general";
import { OrderSource, orderStatus, PaymentStatus } from "../../../rest-api/enum/orders";

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
    default:0
  },
  deliveryFee: {
    type: Number,
    default:0
  },
  status: {
    type: String,
    enum: Object.values(orderStatus),
    default: orderStatus.ORDER_PLACED,
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
  assignedTo:{
    type:Schema.Types.ObjectId,
    refPath: "assignToModelName"
  },
  assignToModelName:{
    type:String,
    enum:["Rider","T3PL"]
  },
 
  deliveryDate: {
    type: Date,
  },
  paymentStatus:{
    type:String,
    enum: Object.values(PaymentStatus),
    default: PaymentStatus.PENDING
  },
  productImage: {
    type: String,
  },
  confirmDeliverOTP:{
    type:String
  },
  rejectedReasons:{
    type:String
  }
}, { timestamps: true });


const OrderModel = model<IOrder>("Order", OrderSchema);


export default OrderModel;


//  assignedTo: new Schema({
//     type:{
//       type:String
//     },
//     entityAssignedId:{
//       type:Schema.Types.ObjectId
//     }
//   },{_id:false}) ,