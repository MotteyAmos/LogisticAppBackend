// import { AuthController } from "./controllers/admin.dispatcher.controller";
import { AuthController } from "./controllers/staffs.controller.ts";
import { GeneralAuthController } from "./controllers/general.controller.ts";
// import { T3PLAuthController } from "./controllers/T3PL.controller.ts";
// import { VendorAuthController } from "./controllers/vendor.controller.ts";
// import { GeneralAuthService } from "../../auth/services/general.service.ts";
// import { T3PLAuthService } from "./services/T3Pls.service.ts";
// import { VendorAuthService } from "./services/vendor.service.ts";
import { AuthService } from "./services/staffs.service.ts";
import { GeneralAuthService } from "./services/general.service.ts";

const authService = new AuthService()
// const vendorService = new VendorAuthService()
const staffsController = new AuthController(authService);
// const vendorController = new VendorAuthController(vendorService)
// const T3PLService = new T3PLAuthService();
// const T3PLController = new T3PLAuthController(T3PLService)
const generalService = new GeneralAuthService();
const generalController = new GeneralAuthController(generalService)



export {staffsController, generalController }

