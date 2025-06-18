import { OrderIdPoolModel } from "../../../database/models/orders/orderIdPool";
import OrderModel from "../../../database/models/orders/orderModule";
import { AddOrderDTO, DeleteOrderIdDTO, IUpdateOrderDTO } from "../../types/orders/general";
import { BadRequestException } from "../../utils/catch-error";
import { incrementOrderId } from "../../utils/orders/generateOrderId";
import { indexToOrderId } from "../../utils/orders/IndexToOrderId";
import { numberToOrderId } from "../../utils/orders/numberToOrderId";
import { orderIdToNumber } from "../../utils/orders/orderIdToNumber";

export class GeneralOrderService {
  public async addSingleOrder(orderDTO: AddOrderDTO) {
    // this.createOrderIdPool()
  
    const orderBulk = OrderModel.collection.initializeUnorderedBulkOp();

    for (const order of orderDTO) {
      const orderId = await this.assignOrderId();

      let productImage;
      if (order?.productImage?.imageUrl) {
        productImage = order.productImage.imageUrl;
      } else if (order?.productImage?.imageFile) {
        // upload image to S3 and assign to productImage
        // productImage = await uploadToS3(order.productImage.imageFile);
      }

      orderBulk.insert({ ...order, orderId, productImage });
    }

    if (orderDTO.length > 0) {
      await orderBulk.execute();
    }

    if (orderDTO.length === 1) {
      return "Order added successful";
    } else {
      return "Orders added successul";
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

  public async deleteOrders(orders:DeleteOrderIdDTO){
// I used this approach to get high performance
    const _ids = orders.map(order=>order.id)    
    const ordersToDelete = await OrderModel.find({_id: {$in: _ids}}).lean(); // lean() makes it faster

    if (ordersToDelete.length ===0){
        throw new BadRequestException("No orders found matching criteria")
    }

    const deleteResult = await OrderModel.deleteMany({_id: {$in: _ids}});

    const orderPollBulk = OrderIdPoolModel.collection.initializeUnorderedBulkOp();

    for (const order of ordersToDelete){
      const orderId = order.orderId
      orderPollBulk.find({ orderId: orderId }).update({ $set: {assigned:false} });

    }
  
    orderPollBulk.execute()
    

    if (orders.length >1){
      return "Orders delete successful"
    }else{
      return "Order deleted successful"
    }

  }
}
