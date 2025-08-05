import { Document } from "mongoose";
import { OrderAssignedTo, orderStatus } from "../../enum/orders";
import { Request } from "express";


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
  source: {
    type: "SELF"|"VENDOR",
    vendorID?:String
  };
  assignedTo:{
    type:String,
    entityAssignedId:String
  } ;
  deliveryDate?: Date;
  productImage?: String;
  rejectedReasons?:String
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
  source: {
    type: "SELF"|"VENDOR",
    vendorID?:String
  };
  assignedTo?:{
    type: OrderAssignedTo,
    entityAssignedId: String
  },
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
  assignedTo?:{
    type?: OrderAssignedTo,
    entityAssignedId?: String
  },
  productImage?:String
  //  {
  //   imageFile?:String,
  //   imageUrl?:String
  // }
  rejectedReason?:String
}

export  type IUpdateOrderDTO = UpdatedAbleOptions[]

interface delOrder{
  id:String,
  orderId:String
}

export type DeleteOrderIdDTO = delOrder[]