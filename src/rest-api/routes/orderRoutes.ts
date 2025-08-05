import { Router } from "express";
import { generalController } from "../module/order.module";
import { OrderImageUploadFile, uploadOrder } from "../middleware/fileUpload";



const route = Router();


route.post("/", OrderImageUploadFile.single("productImage"),generalController.addSingleOrder)
// route.patch("/", generalController.updateOrder);
route.delete("/",generalController.deleteOrder)



route.post("/uploadByCsvExcel",(req,res,next)=>{console.log(req);next()},  uploadOrder.single("Orders"),  generalController.uploadOrderByCsvExcell)
export const orderRoute = route;

