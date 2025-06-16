import { model, Schema } from "mongoose";
import { IOrder } from "../../../rest-api/validators/orders/general";
import { orderStatus } from "../../../rest-api/enum/orders";

const OrderSchema: Schema<IOrder> = new Schema<IOrder>({
  orderDate: {
    type: Date,
    default: Date.now,
  },
  orderId: {
    type: String,
    required: true,
    unique: true,
  },
  destination: {
    type: String,
    required: true,
  },
  location: {
    lat: { type: Number },
    lng: { type: Number },
  },
  recipient: {
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
    required: true,
  },
  status: {
    type: String,
    enum: Object.values(orderStatus),
    default: orderStatus.PENDING,
  },
  source:{
    type: {
       type:   String,
       enum :["SELF", "VENDOR"],
       required:true
    },
    vendorID:{
        type:Schema.Types.ObjectId,
        ref:"Vendor"
    }
  },
  thirdPartyLogistics: {
    type: String,
  },
  deliveryDate: {
    type: Date,
  },
  productImage: {
    type: String,
  },
}, { timestamps: true });


const OrderModel = model<IOrder>("Order", OrderSchema);


export default OrderModel;