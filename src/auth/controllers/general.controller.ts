import { Request, Response } from "express";
import { asyncHandler } from "../../middleware/asyncHandler";
import { HTTPSTATUS } from "../../config/http.config";
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
            

            const {accessToken,refreshToken,user} = await this.authService.login(body)


            return res.status(HTTPSTATUS.OK).json({
                accessToken,
                refreshToken,
                user,
                message:"User Login Successuful"
            })
        }
    )

  
}