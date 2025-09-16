import { Router,Response } from "express";
import { staffsController, generalController, vendorController, riderController, T3PLController } from "../module/auth.module.ts";
// import { verifyIsAuthenticated } from "../auth/middlewares/verifyIsAuthenticated.ts";

import { Role } from "../enum/general.ts";
import {riderFilefields, T3plFilefields, uploadFile,VendorUploadFile } from "../middleware/fileUpload.ts";
import {  canCreateStaff } from "../middleware/auth/permissions.ts";
import { verifyIsAuthenticated } from "../middleware/auth/verifyIsAuthenticated.ts";


const route = Router();

//don't forget only admin can create a role, so let work on it later
// route.post("/permission", generalController.createPermission)
// route.patch("/permission", generalController.updatePermission)
// route.delete("/permission/:id", generalController.deletePermission)

route.delete("/role/:id", canCreateStaff(), generalController.deleteRole)
route.post("/role", canCreateStaff(),generalController.createRole)
route.get("/roles",canCreateStaff(), generalController.getRoles)
route.patch("/role",canCreateStaff(), generalController.updateRole)

route.post("/staff",canCreateStaff(),staffsController.register)
route.patch("/staff",canCreateStaff(), staffsController.updateStaff)
route.delete("/staff/:id",canCreateStaff(), staffsController.deleteStaff)

route.post("/signin", generalController.login);
route.post("/refreshToken", generalController.refreshToken);
route.post("/logout", generalController.logout)
route.post("/forgotPassword", generalController.forgotPassword);


route.post("/register/vendor", VendorUploadFile.single("businessLogo"),vendorController.register)
route.patch("/approval/vendor", vendorController.registrationApprovement)
route.delete("/vendor/:id", vendorController.deleteVendor)


route.post("/register/rider",uploadFile.fields(riderFilefields) ,riderController.registration)
route.patch("/approval/rider", riderController.registrationApprovement)
route.delete("/rider/:id", riderController.deleteRider)


route.post("/register/3pl", uploadFile.fields(T3plFilefields) ,T3PLController.register)
route.patch("/approval/3pl", T3PLController.registrationApprovement)
route.delete("/3pl/:id",T3PLController.deleteVendor)

// route.post("/")
// route.post("/register/T3pl", T3PLController.register)
// route.patch("/verifyVendorAccount",verifyIsAuthenticated,isAuthorized([Role.ADMIN]),adminDispatcherController.verifyVendorAccount)
// route.patch("/verifyT3PlAccount",verifyIsAuthenticated,isAuthorized([Role.ADMIN]),adminDispatcherController.verifyT3PlAccount)
// route.patch("/verifyDispatcherAccount",verifyIsAuthenticated,isAuthorized([Role.ADMIN]),adminDispatcherController.verifyAdminAccount)




export const authRoute = route;