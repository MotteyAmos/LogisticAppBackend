import { GeneralOrderController } from "../controllers/orders/general.controller";
import { GeneralOrderService } from "../services/orders/GeneralOrder.service";








const generalOrderService = new GeneralOrderService();
const generalController = new GeneralOrderController(generalOrderService);



export {generalController}

