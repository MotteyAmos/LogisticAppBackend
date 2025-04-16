import { Request, Response } from "express";
import { asyncHandler } from "../../middleware/asyncHandler";
import { HTTPSTATUS } from "../../config/http.config";
import { AuthService } from "../services/admin.dispatcher.service";
import { adminRegisterSchema } from "../validators/admin.dispatcher";
import { GeneralAuthService } from "../services/general.service";
import { loginSchema } from "../validators/general";

// this contorller will handle requests from all users

export class GeneralAuthController {
    private authService: GeneralAuthService;
    
    constructor(authService:GeneralAuthService){
        this.authService=authService
    }

    public login = asyncHandler(
        async (req:Request, res:Response): Promise<any>=>{
            const userAgent = req.headers["user-agent"];

            const body = loginSchema.parse({...req.body,userAgent})

            // const {} = await this.authService.login(body)
        }
    )

  
}