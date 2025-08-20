import { asyncHandler } from "../../middleware/asyncHandler";
import { GeneralOrderService } from "../../services/orders/GeneralOrder.service";
import { Request, Response } from "express";
import {
  addOrderSchema,
  addSingleOrderSchema,
  assignToSchema,
  deleteOrderSchema,
  orderDeliveredSchema,
  orderFailedSchema,
  updateOrderSchema,
} from "../../validators/orders/general";
import { HTTPSTATUS } from "../../config/http.config";
import { IdSchema } from "../../validators/auth/general";
import { getAuthCookies } from "../../utils/auth/cookies";
import { UnauthorizedException } from "../../utils/catch-error";
import OrderCounterModel from "../../../database/models/orders/OrderCounter";
import { ErrorCode } from "../../enum/errorCode";

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

  public deleteOneOrder = asyncHandler(
    async (req: Request, res: Response): Promise<any> => {
      const orderId = IdSchema.parse(req.params?.id);

      const msg = await this.orderService.deleteOneOrder(orderId);

      return res.status(HTTPSTATUS.OK).json({
        message: msg,
      });
    }
  );


  public assignTo = asyncHandler(
    async (req:Request, res:Response): Promise<any> =>{
     
      const assignToBody = assignToSchema.parse(req.body);

      const msg = await this.orderService.assignOrder(assignToBody);

      return res.status(HTTPSTATUS.OK).json({
        message: msg,
      });
    }
  )


    public OrderInTransit = asyncHandler(
    async (req:Request, res:Response): Promise<any> =>{
      const { id } = req.params;
      const _id= IdSchema.parse(id)

      const msg = await this.orderService.OrderInTransit(_id);

      return res.status(HTTPSTATUS.OK).json({
        message: msg,
      });
    }
  )

  public OrderCompleted = asyncHandler(
    async (req:Request,res:Response):Promise<any> =>{

      const body = orderDeliveredSchema.parse(req?.body);

      const msg = await this.orderService.OrderCompleted(body);

      return res.status(HTTPSTATUS.OK).json({
        message: msg,
      });
    }
  )

 
  public filedOrder = asyncHandler(
    async (req:Request,res:Response):Promise<any> =>{

      const body =orderFailedSchema.parse(req?.body);

      const msg = await this.orderService.FiledOrder(body);

      return res.status(HTTPSTATUS.OK).json({
        message: msg,
      });
    }
  )

   public rejectedOrder = asyncHandler(
    async (req:Request,res:Response):Promise<any> =>{

      const body =orderFailedSchema.parse(req?.body);

      const msg = await this.orderService.RejectedOrder(body);

      return res.status(HTTPSTATUS.OK).json({
        message: msg,
      });
    }
  )

  public createOrderCounter = asyncHandler(
    async(req:Request, res:Response):Promise<any> =>{

        const orderCounter = await OrderCounterModel.create(req.body);

         return res.status(HTTPSTATUS.OK).json({
       orderCounter
      });
    }
  )


}
