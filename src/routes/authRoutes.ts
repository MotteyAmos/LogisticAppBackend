import { Router } from "express";
import { adminDispatcherController, vendorController,T3PLController, generalController } from "../auth/auth.module";



const route = Router();

route.post(['/register/admin','/register/dispatcher'], adminDispatcherController.register)
route.post("/register/vendor", vendorController.register)
route.post("/register/T3pl", T3PLController.register)
route.post("/login", generalController.login);
export const authRoute = route;