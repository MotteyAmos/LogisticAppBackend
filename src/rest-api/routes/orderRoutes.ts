import { Router } from "express";
import { generalController } from "../module/order.module";
import { OrderImageUploadFile, uploadOrder } from "../middleware/fileUpload";



const route = Router();

// route.post("/createOrderCounter", generalController.createOrderCounter)

route.post("/", OrderImageUploadFile.single("productImage"),generalController.addSingleOrder)
// route.patch("/", generalController.updateOrder);
route.delete("/",generalController.deleteOrder)  //deletes orders in bulks
route.delete("/:id", generalController.deleteOneOrder)



route.post("/uploadByCsvExcel", uploadOrder.single("Orders"),  generalController.uploadOrderByCsvExcell)
route.patch("/assignTo",generalController.assignTo)
route.patch("/transit/:id", generalController.OrderInTransit)
route.patch("/completed", generalController.OrderCompleted)
route.patch("/failed", generalController.filedOrder);
route.patch("/rejected", generalController.rejectedOrder)




export const orderRoute = route;

