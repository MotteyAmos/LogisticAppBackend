import { asyncHandler } from "../../middleware/asyncHandler";
import { GeneralOrderService } from "../../services/orders/GeneralOrder.service";
import { Request, Response } from "express";
import {
  addOrderSchema,
  addSingleOrderSchema,
  deleteOrderSchema,
  updateOrderSchema,
} from "../../validators/orders/general";
import { HTTPSTATUS } from "../../config/http.config";

export class GeneralOrderController {
  private orderService: GeneralOrderService;

  constructor(orderService: GeneralOrderService) {
    this.orderService = orderService;
  }

  public addSingleOrder = asyncHandler(
    async (req: Request, res: Response): Promise<any> => {
      const order = addSingleOrderSchema.parse({
        ...req.body,
        source: JSON.parse(req.body.source || "{}"),
      });

      const msg = await this.orderService.addSingleOrder({ req, body: order });

      return res.status(HTTPSTATUS.CREATED).json({
        message: msg,
      });
    }
  );

  //   public updateOrder = asyncHandler(
  //     async (req: Request, res: Response): Promise<any> => {
  //       const orders = updateOrderSchema.parse(req.body);

  //       const msg = await this.orderService.upadateOrders(orders);

  //       return res.status(HTTPSTATUS.OK).json({
  //         message: msg,
  //       });
  //     }
  //   );

  public uploadOrderByCsvExcell = asyncHandler(
    async (req: Request, res: Response): Promise<any> => {
      
      const msg =await this.orderService.uploadOrderByCsvExcell(req, res);

       return res.status(HTTPSTATUS.OK).json({
        message: msg ,
      });
    }
  );

  public deleteOrder = asyncHandler(
    async (req: Request, res: Response): Promise<any> => {
      const orders = deleteOrderSchema.parse(req.body);

      const msg = await this.orderService.deleteOrders(orders);

      return res.status(HTTPSTATUS.OK).json({
        message: msg,
      });
    }
  );
}
