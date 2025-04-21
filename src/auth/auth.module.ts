// import { AuthController } from "./controllers/admin.dispatcher.controller";
import { AuthController } from "./controllers/admin.dispatcher.controller";
import { GeneralAuthController } from "./controllers/general.controller";
import { T3PLAuthController } from "./controllers/T3PL.controller";
import { VendorAuthController } from "./controllers/vendor.controller";
import { AuthService } from "./services/admin.dispatcher.service";
import { GeneralAuthService } from "./services/general.service";
import { T3PLAuthService } from "./services/T3Pls.service";
import { VendorAuthService } from "./services/vendor.service";


const authService = new AuthService()
const vendorService = new VendorAuthService()
const adminDispatcherController = new AuthController(authService);
const vendorController = new VendorAuthController(vendorService)
const T3PLService = new T3PLAuthService();
const T3PLController = new T3PLAuthController(T3PLService)
const generalService = new GeneralAuthService();
const generalController = new GeneralAuthController(generalService)
export {adminDispatcherController,vendorController ,T3PLController, generalController }

