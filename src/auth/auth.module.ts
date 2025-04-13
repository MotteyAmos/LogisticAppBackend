// import { AuthController } from "./controllers/admin.dispatcher.controller";
import { AuthController } from "./controllers/admin.dispatcher.controller";
import { AuthService } from "./services/admin.dispatcher.service";


const authService = new AuthService()
const adminDispatcherController = new AuthController(authService);


export {adminDispatcherController}

