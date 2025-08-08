import { Router } from "express";
import { generalController } from "../module/order.module";
import { OrderImageUploadFile, uploadOrder } from "../middleware/fileUpload";



const route = Router();


route.post("/", OrderImageUploadFile.single("productImage"),generalController.addSingleOrder)
// route.patch("/", generalController.updateOrder);
route.delete("/",generalController.deleteOrder)



route.post("/uploadByCsvExcel", uploadOrder.single("Orders"),  generalController.uploadOrderByCsvExcell)
route.patch("/assignTo",generalController.assignTo)
route.patch("/transit/:id", generalController.OrderInTransit)





export const orderRoute = route;

