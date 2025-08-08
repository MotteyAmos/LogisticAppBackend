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
import { BadRequestException } from "../../utils/catch-error";
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
import { orderStatus } from "../../enum/orders";
import { sendMessage } from "../../utils/SNS";
import { generateRandomNumber } from "../../utils/generateRandomNumber";

export class GeneralOrderService {
  public async addSingleOrder(orderDTO: AddSingleOrderDTO) {
    const orderId = await this.assignOrderId();

    const order = await OrderModel.create({
      ...orderDTO.body,
      orderId: orderId,
    });

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
      const { orders, errors } = await parseCSV(filePath as PathLike);

      if (errors.length > 0) {
        throw new BadRequestException(
          `${errors[0]?.message} on row number ${errors[0]?.row}`,
          ErrorCode.MISSING_FIELDS
        );
      }

      const { success, failed } = await this.addBulkOrders(orders);
        console.log(success)
      if (failed.length > 0) {
        console.error("Failed orders:");
        throw new AppError("Sorry an error while saving some of the orders")
        // failed.forEach((f) => {

        //   console.log(`- Order ${f.index + 1}: ${f.errorMessage}`);
        //   console.log(`  Document: ${JSON.stringify(f.document)}`);
        // });
      }

      return "Orders uploaded successfully"

   
    } else if (originalName?.endsWith(".xls") || originalName?.endsWith(".xlsx") ) {
      const { orders, errors } = parseExcel(filePath as string);

      if (errors.length > 0) {
        throw new BadRequestException(
          `${errors[0]?.message} on row number ${errors[0]?.row}`,
          ErrorCode.MISSING_FIELDS
        );
      }

       const { success, failed } = await this.addBulkOrders(orders);
     

      if (failed.length > 0) {
        console.error("Failed bulk orders:");
        throw new AppError("Sorry an error while saving some of the orders")
        // failed.forEach((f) => {

        //   console.log(`- Order ${f.index + 1}: ${f.errorMessage}`);
        //   console.log(`  Document: ${JSON.stringify(f.document)}`);
        // });
      }

      return "Orders uploaded successfully"


    } else {
      // console.log("an error occured");
      throw new AppError("Unsupported file type");
      // res.status(400).json({ error: "Unsupported file type" });
    }
  }

  private async addBulkOrders(orderDTO: IAddOrder[]) {
    const orderBulk = OrderModel.collection.initializeUnorderedBulkOp();

    const documentsByIndex = new Map<number, IAddOrder>();
    let index = 0;

    for (const order of orderDTO) {
      const orderId = await this.assignOrderId();

      index += 1;
      orderBulk.insert({ ...order, orderId });
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

  private async assignOrderId() {
    const orderIdDoc = await OrderIdPoolModel.findOneAndUpdate(
      { assigned: false },
      { $set: { assigned: true } },
      { new: true }
    );

    if (!orderIdDoc)
      throw new Error("No available Order IDs. Delete some of your orders");

    return orderIdDoc.orderId;
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


  public async assignOrder(assignDTO:AssignOrderDTO){

    const order = await OrderModel.findById(assignDTO.orderId);

    if (!order){
      throw new BadRequestException("Order does not exist");
    }

    order.assignedTo = assignDTO.assignToID as unknown as Types.ObjectId;
    order.assignToModelName = assignDTO.assignToModelName 
    order.deliveryFee =assignDTO.deliveryFee 
    order.status = orderStatus.ASSIGNED
    await order.save()

    return "Order assign successful"
  }

    public async OrderInTransit(orderId:String){

    const order = await OrderModel.findById(orderId);

    if (!order){
      throw new BadRequestException("Order does not exist");
    }



    order.status = orderStatus.IN_TRANSIT

    const otp = generateRandomNumber()
    await sendMessage({msg:otp,to:""})
    
    order.confirmDeliverOTP = otp
    await order.save()

    return "Order In Transit"
  }

  
}
