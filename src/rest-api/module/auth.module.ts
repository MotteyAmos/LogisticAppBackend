// import { AuthController } from "./controllers/admin.dispatcher.controller";
import { AuthController } from "../controllers/auth/staffs.controller.ts";
import { GeneralAuthController } from "../controllers/auth/general.controller.ts";

import { AuthService } from "../services/auth/staffs.service.ts";
import { GeneralAuthService } from "../services/auth/general.service.ts";
import { VendorAuthService } from "../services/auth/vendor.service.ts";
import { VendorAuthController } from "../controllers/auth/vendor.controller.ts";
import { RiderService } from "../services/auth/rider.service.ts";
import { RiderController } from "../controllers/auth/rider.controller.ts";
import { T3PLAuthService } from "../services/auth/T3PLs.service.ts";
import { T3PLAuthController } from "../controllers/auth/T3PL.controller.ts";

const authService = new AuthService()
const vendorService = new VendorAuthService()
const staffsController = new AuthController(authService);
const vendorController = new VendorAuthController(vendorService)
const riderService = new RiderService();
const riderController = new RiderController(riderService);
const T3PLService = new T3PLAuthService();
const T3PLController = new T3PLAuthController(T3PLService)
const generalService = new GeneralAuthService();
const generalController = new GeneralAuthController(generalService)



export {staffsController, generalController ,vendorController,riderController,T3PLController}

