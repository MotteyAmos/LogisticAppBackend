import { Router } from "express";
import { adminDispatcherController, vendorController,T3PLController } from "../auth/auth.module";



const route = Router();

route.post(['/register/admin','/register/dispatcher'], adminDispatcherController.register)
route.post("/register/vendor", vendorController.register)
route.post("/register/T3pl", T3PLController.register)
export const authRoute = route;