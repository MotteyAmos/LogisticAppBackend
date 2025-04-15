// import { AuthController } from "./controllers/admin.dispatcher.controller";
import { AuthController } from "./controllers/admin.dispatcher.controller";
import { VendorAuthController } from "./controllers/vendor.controller";
import { AuthService } from "./services/admin.dispatcher.service";
import { VendorAuthService } from "./services/vendor.service";


const authService = new AuthService()
const vendorService = new VendorAuthService()
const adminDispatcherController = new AuthController(authService);
const vendorController = new VendorAuthController(vendorService)

export {adminDispatcherController,vendorController }

