import { Router } from "express";
import { adminDispatcherController } from "../auth/auth.module";


const route = Router();

route.post(['/register/admin','/register/dispatcher'], adminDispatcherController.register)


export const authRoute = route;