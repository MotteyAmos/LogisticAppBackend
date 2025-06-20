import { Router } from "express";
import { generalController } from "../module/order.module";


const route = Router();


route.post("/", generalController.addSingleOrder)
route.patch("/", generalController.updateOrder);
route.delete("/",generalController.deleteOrder)

export const orderRoute = route;