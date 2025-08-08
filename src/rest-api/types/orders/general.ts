import { Document,Types } from "mongoose";
import { OrderAssignedTo, orderStatus, PaymentStatus } from "../../enum/orders";
import { Request } from "express";
import { Schema } from "zod";


export interface IOrder extends Document {
  orderDate?: Date;
  orderId?: String;
  destination: String;
  productDescription:String
  location?: {
    lat: Number;
    lng: Number;
  };
  recipientName: String;
  recipientNumber: String;
  paymentAmount: Number;
  deliveryFee?: Number;
  status?: orderStatus;
  paymentStatus?: PaymentStatus,
  source: {
    type: "SELF"|"VENDOR",
    vendorID?:String
  };
  assignedTo?:Types.ObjectId;
  assignToModelName?: "Rider"|"T3PL";
  deliveryDate?: Date;
  productImage?: String;
  rejectedReasons?:String
  confirmDeliverOTP?:String
}


export interface IAddOrder{
  destination: String;
  productDescription?:String
  location?: {
    lat: Number;
    lng: Number;
  };
  recipientName: String;
  recipientNumber: String;
  paymentAmount: String;
  deliveryFee?: String;
  status?:String;
  source: {
    type: "SELF"|"VENDOR",
    vendorID?:String
  };
  // assignedTo?:Types.ObjectId;
  // assignToModelName?: "Rider"|"Rider";
  productImage?:String
  //  {
  //   imageFile?:String,
  //   imageUrl?:String
  // };
}






export interface AddSingleOrderDTO  {req:Request, body: IAddOrder}

export  type AddOrderDTO = IAddOrder[]

interface UpdatedAbleOptions{
  id:String
  orderId:String
  destination?: String;
  productDescription?:String
  location?: {
    lat?: Number;
    lng?: Number;
  };
  recipientName?: String;
  recipientNumber?: String;
  paymentAmount?: Number;
  deliveryFee?: Number;
  status?:orderStatus
  source?: {
    type?: "SELF"|"VENDOR",
    vendorID?:String
  };
  deliveryDate?:String
  assignedTo?:Types.ObjectId;
  assignToModelName?: "Rider"|"T3PL";
  productImage?:String
  //  {
  //   imageFile?:String,
  //   imageUrl?:String
  // }
  rejectedReason?:String
}


export interface AssignOrderDTO{
  orderId:String,
  deliveryFee: Number,
  assignToID: String,
  assignToModelName:"Rider" | "T3PL"
}
export  type IUpdateOrderDTO = UpdatedAbleOptions[]

interface delOrder{
  id:String,
  orderId:String
}

export type DeleteOrderIdDTO = delOrder[]