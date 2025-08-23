import { OrderIdPoolModel } from "../../../database/models/orders/orderIdPool";
import OrderModel from "../../../database/models/orders/orderModule";
import { OrderImageUploadToS3 } from "../../middleware/fileUpload";
import { Request, Response } from "express";
import {
  AddOrderDTO,
  AddSingleOrderDTO,
  AssignOrderDTO,
  DeleteOrderIdDTO,
  IAddOrder,
  IUpdateOrderDTO,
} from "../../types/orders/general";
import {
  BadRequestException,
  UnauthorizedException,
} from "../../utils/catch-error";
import { incrementOrderId } from "../../utils/orders/generateOrderId";
import { indexToOrderId } from "../../utils/orders/IndexToOrderId";
import { numberToOrderId } from "../../utils/orders/numberToOrderId";
import { orderIdToNumber } from "../../utils/orders/orderIdToNumber";
import { parseCSV, parseExcel } from "../../utils/orders/excleCsvParser";
import { PathLike } from "fs";
import { AppError } from "../../utils/AppError";
import { ErrorCode } from "../../enum/errorCode";
import { BulkWriteResult, WriteError } from "mongodb";

import { assignToSchema } from "../../validators/orders/general";
import { Types } from "mongoose";
import { orderStatus, PaymentStatus } from "../../enum/orders";
import { sendMessage } from "../../utils/SMS";
import { generateRandomNumber } from "../../utils/generateRandomNumber";
import {
  getAuthCookies,
  getPayloadFromAccessToken,
} from "../../utils/auth/cookies";
import OrderCounterModel from "../../../database/models/orders/OrderCounter";

export class GeneralOrderService {
  public async addSingleOrder(orderDTO: AddSingleOrderDTO) {
    const orderId = await this.assignOrderId(orderDTO.req);

    const payload = getPayloadFromAccessToken(orderDTO.req)


    const order = 
      payload.UserType !== "VENDOR"?
    await OrderModel.create({
      ...orderDTO.body,
      paymentAmount: Number.parseFloat(orderDTO?.body?.paymentAmount as string),
      deliveryFee: orderDTO?.body?.deliveryFee ?  Number.parseFloat(orderDTO?.body?.deliveryFee as string): 0,
      orderId: orderId,

    }):
        await OrderModel.create({
      ...orderDTO.body,
      paymentAmount: Number.parseFloat(orderDTO?.body?.paymentAmount as string),
      deliveryFee: orderDTO?.body?.deliveryFee ?  Number.parseFloat(orderDTO?.body?.deliveryFee as string): 0,
      orderId: orderId,
      source:{
        type:"VENDOR",
        vendorID: payload.userId
      }
    })


    if (orderDTO?.req?.file) {
      const orderImageUri = await OrderImageUploadToS3(
        order._id as String,
        orderDTO.req
      );
      order.productImage = orderImageUri as String;
    }

    await order.save();

    return "Order uploaded successful";
  }

  public async uploadOrderByCsvExcell(req: Request, res: Response) {
    const filePath = req?.file?.path;
    const originalName = req?.file?.originalname;

    if (originalName?.endsWith(".csv")) {
      const { orders, errors } = await parseCSV(filePath as PathLike, req);

      if (errors.length > 0) {
        throw new BadRequestException(
          `${errors[0]?.message} on row number ${errors[0]?.row}`,
          ErrorCode.MISSING_FIELDS
        );
      }

      const { success, failed } = await this.addBulkOrders(orders,req);
     
      if (failed.length > 0) {
    
        throw new AppError("Sorry an error while saving some of the orders");
        // failed.forEach((f) => {

        //   console.log(`- Order ${f.index + 1}: ${f.errorMessage}`);
        //   console.log(`  Document: ${JSON.stringify(f.document)}`);
        // });
      }

      return "Orders uploaded successfully";
    } else if (
      originalName?.endsWith(".xls") ||
      originalName?.endsWith(".xlsx")
    ) {
      const { orders, errors } = parseExcel(filePath as string);

      if (errors.length > 0) {
        throw new BadRequestException(
          `${errors[0]?.message} on row number ${errors[0]?.row}`,
          ErrorCode.MISSING_FIELDS
        );
      }

      const { success, failed } = await this.addBulkOrders(orders,req);

      if (failed.length > 0) {
        console.error("Failed bulk orders:");
        throw new AppError("Sorry an error while saving some of the orders");
        // failed.forEach((f) => {

        //   console.log(`- Order ${f.index + 1}: ${f.errorMessage}`);
        //   console.log(`  Document: ${JSON.stringify(f.document)}`);
        // });
      }

      return "Orders uploaded successfully";
    } else {
      // console.log("an error occured");
      throw new AppError("Unsupported file type");
      // res.status(400).json({ error: "Unsupported file type" });
    }
  }

  private async addBulkOrders(orderDTO: IAddOrder[],req:Request) {
    const orderBulk = OrderModel.collection.initializeUnorderedBulkOp();
    const payload = getPayloadFromAccessToken(req)
    const documentsByIndex = new Map<number, IAddOrder>();
    let index = 0;

    for (const order of orderDTO) {
      const orderId = await this.assignOrderId(req);

      index += 1;
      if (payload.UserType !=="VENDOR"){
      orderBulk.insert({ ...order, orderId,
        orderDate: new Date(),
        createdAt:new Date(),
        updatedAt:new Date()
       });
      } else{
              orderBulk.insert({ ...order, orderId,
        source:{
            type:"VENDOR",
            vendorID: payload.userId
        }
       });
      }

      documentsByIndex.set(index, order);
    }

    try {
      const result = await orderBulk.execute();

      // Get inserted count from result (new way)
      const successCount = result.insertedCount;

      if (result.hasWriteErrors()) {
        const errors = result.getWriteErrors().map((err) => ({
          index: err.index,
          errorCode: err.code,
          errorMessage: err.errmsg,
          document: documentsByIndex.get(err.index),
        }));

        return {
          success: successCount,
          failed: errors,
        };
      }

      return {
        success: successCount,
        failed: [],
      };
    } catch (err) {
      return {
        success: 0,
        failed: [],
        error: err instanceof Error ? err.message : "Unknown error",
      };
    }
  }

  // private async assignOrderId() {
  //   const orderIdDoc = await OrderIdPoolModel.findOneAndUpdate(
  //     { assigned: false },
  //     { $set: { assigned: true } },
  //     { new: true }
  //   );

  //   if (!orderIdDoc)
  //     throw new Error("No available Order IDs. Delete some of your orders");

  //   return orderIdDoc.orderId;
  // }

  private async assignOrderId(req: Request) {
    const payload = getPayloadFromAccessToken(req);

    if (!payload.UserType) {
      throw new UnauthorizedException(
        "Expired access token",
        ErrorCode.EXPIRED_ACCESS_TOKEN
      );
    }

    if (payload.UserType === "STAFF") {
      const counter = await OrderCounterModel.findOneAndUpdate(
        { source: "SELF" },
        { $inc: { lastOrderCounter: 1 } },
        { upsert: true, returnDocument: "after" }
      );
      let orderNumber;
      if (counter?.lastOrderCounter) {
        orderNumber = counter?.lastOrderCounter?.toString().padStart(5, "0");
      }
      const orderId = `SELF${orderNumber}`;

      return orderId;
    } else if (payload.UserType === "VENDOR") {
      const counter = await OrderCounterModel.findOneAndUpdate(
        { vendorId: payload.userId },
        { $inc: { lastOrderCounter: 1 } },
        { upsert: true, returnDocument: "after" }
      );

      let orderId;
      if (counter?.lastOrderCounter && counter?.initials) {
        let orderNumber = counter?.lastOrderCounter
          ?.toString()
          .padStart(5, "0");
        orderId = `${counter?.initials}${orderNumber}`;
      }
      return orderId;
    }
  }

  private async createOrderIdPool() {
    const bulk = OrderIdPoolModel.collection.initializeUnorderedBulkOp();

    for (let i = 0; i < 100000; i++) {
      const orderId = indexToOrderId(i);
      bulk.insert({ orderId, assigned: false });
    }

    await bulk.execute();
  }

  public async upadateOrders(orders: IUpdateOrderDTO) {
    const orderBulk = OrderModel.collection.initializeUnorderedBulkOp();

    orders.forEach((order) => {
      orderBulk.find({ _id: order.id }).update({ $set: order });
    });

    await orderBulk.execute();
    // const ordersNotFoundIDs = []
    // orders.forEach(async (order) => {
    //   const updatedOrder = await OrderModel.findByIdAndUpdate(
    //     order.id,
    //     { ...order },
    //     { new: true }
    //   );

    // });

    if (orders.length === 1) {
      return "Order updated successful";
    } else {
      return "Orders updated successul";
    }
  }

  public async deleteOrders(orders: DeleteOrderIdDTO) {
    // I used this approach to get high performance
    const _ids = orders.map((order) => order.id);
    const ordersToDelete = await OrderModel.find({ _id: { $in: _ids } }).lean(); // lean() makes it faster

    if (ordersToDelete.length === 0) {
      throw new BadRequestException("No orders found matching criteria");
    }

    const deleteResult = await OrderModel.deleteMany({ _id: { $in: _ids } });

    const orderPollBulk =
      OrderIdPoolModel.collection.initializeUnorderedBulkOp();

    for (const order of ordersToDelete) {
      const orderId = order.orderId;
      orderPollBulk
        .find({ orderId: orderId })
        .update({ $set: { assigned: false } });
    }

    orderPollBulk.execute();

    if (orders.length > 1) {
      return "Orders delete successful";
    } else {
      return "Order deleted successful";
    }
  }

  public async deleteOneOrder(orderId: String) {
    const order = await OrderModel.findByIdAndDelete(orderId);

    if (!order) {
      throw new BadRequestException("Order does not exist");
    }

    return "Order deleted successfull";
  }

  public async assignOrder(assignDTO: AssignOrderDTO) {
    const order = await OrderModel.findById(assignDTO.orderId);

    if (!order) {
      throw new BadRequestException("Order does not exist");
    }

    order.assignedTo = assignDTO.assignToID as unknown as Types.ObjectId;
    order.assignToModelName = assignDTO.assignToModelName;
    order.deliveryFee = assignDTO.deliveryFee;
    order.status = orderStatus.ASSIGNED;
    await order.save();

    return "Order assign successful";
  }

  public async OrderInTransit(orderId: String) {
    const order = await OrderModel.findById(orderId);

    if (!order) {
      throw new BadRequestException("Order does not exist");
    }

    order.status = orderStatus.IN_TRANSIT;

    const otp = generateRandomNumber();
    // const resul =await sendMessage({to:order?.recipientNumber as string,text:otp})

    // return resul
    // order.confirmDeliverOTP = otp
    order.confirmDeliverOTP = "54321";

    await order.save();

    return "Order In Transit";
  }

  public async OrderCompleted({
    orderId,
    otpCode,
  }: {
    orderId: String;
    otpCode: String;
  }) {
    const order = await OrderModel.findById(orderId);

    if (!order) {
      throw new BadRequestException("Order does not exist");
    }

    if (order?.confirmDeliverOTP !== otpCode) {
      throw new BadRequestException("Incorrect OTP code");
    }

    order.confirmDeliverOTP = "";

    order.status = orderStatus.COMPLETED;
    // order.paymentStatus = PaymentStatus.PAID;
    order.deliveryDate = new Date();

    await order.save();
    return "Order In Completed Successfully";
  }

  public async FiledOrder({
    orderId,
    remark,
  }: {
    orderId: String;
    remark: String;
  }) {
    const order = await OrderModel.findById(orderId);

    if (!order) {
      throw new BadRequestException("Order does not exist");
    }

    order.rejectedReasons = remark;

    order.status = orderStatus.FAILED;
    order.deliveryDate = new Date();

    await order.save();
    return "Sorry for the bad news😔😔";
  }

  public async RejectedOrder({
    orderId,
    remark,
  }: {
    orderId: String;
    remark: String;
  }) {
    const order = await OrderModel.findById(orderId);

    if (!order) {
      throw new BadRequestException("Order does not exist");
    }

    order.rejectedReasons = remark;

    order.status = orderStatus.REJECTED;
    order.deliveryDate = new Date();
    await order.save();
    return "Sorry for the bad news😔😔";
  }

  public async payedToVendor(ids:String[]){

    const payedOrders = await OrderModel.updateMany(
      {_id: {$in: ids}},
      {
        $set: {
        paymentStatus: PaymentStatus.PAID,
        paidDate : new Date()
      }
      }     
    )

    if (payedOrders){
      return "Payment made successfully"
    }
  }
}
