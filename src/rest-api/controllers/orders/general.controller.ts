import { asyncHandler } from "../../middleware/asyncHandler";
import { GeneralOrderService } from "../../services/orders/GeneralOrder.service";
import { Request,Response } from "express";



export class GeneralOrderController {

    private orderService: GeneralOrderService;

    constructor(orderService: GeneralOrderService){
        this.orderService = orderService
    }

    public addOrders = asyncHandler(
        async (req:Request, res:Response):Promise<any>=>{
            // const order = o
        }
    )

}







