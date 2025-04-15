import { Router } from "express";
import { adminDispatcherController, vendorController } from "../auth/auth.module";


const route = Router();

route.post(['/register/admin','/register/dispatcher'], adminDispatcherController.register)
route.post("/register/vendor", vendorController.register)

export const authRoute = route;