import { Document } from "mongoose";
import { orderStatus } from "../../enum/orders";

export interface IOrder extends Document {
  orderDate?: Date;
  orderId?: String;
  destination: String;
  productDescription:String
  location?: {
    lat: Number;
    lng: Number;
  };
  recipient: String;
  recipientNumber: String;
  paymentAmount: Number;
  deliveryFee?: Number;
  status?: orderStatus;
  source: {
    type: "SELF"|"VENDOR",
    vendorID?:String
  };
  thirdPartyLogistics: String; // 3PLs
  deliveryDate?: Date;
  productImage?: String;
}