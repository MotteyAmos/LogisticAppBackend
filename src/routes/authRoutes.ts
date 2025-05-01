import { Router } from "express";
import { adminDispatcherController, vendorController,T3PLController, generalController } from "../auth/auth.module";
import { verifyIsAuthenticated } from "../auth/middlewares/verifyIsAuthenticated";
import { isAuthorized } from "../auth/middlewares/authorized";
import { Role } from "../auth/enum/general";



const route = Router();

route.post(['/register/admin','/register/dispatcher'], adminDispatcherController.register)
route.post("/register/vendor", vendorController.register)
route.post("/register/T3pl", T3PLController.register)
route.post("/login", generalController.login);
route.get("/refreshToken", generalController.refreshToken);
route.patch("/verifyVendorAccount",verifyIsAuthenticated,isAuthorized([Role.ADMIN,Role.SUPER_ADMIN]),adminDispatcherController.verifyVendorAccount)
route.patch("/verifyT3PlAccount",verifyIsAuthenticated,isAuthorized([Role.ADMIN,Role.SUPER_ADMIN]),adminDispatcherController.verifyT3PlAccount)
route.patch("/verifyDispatcherAccount",verifyIsAuthenticated,isAuthorized([Role.ADMIN,Role.SUPER_ADMIN]),adminDispatcherController.verifyAdminAccount)



export const authRoute = route;