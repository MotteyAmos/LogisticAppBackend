import { Request, Response } from "express";
import { asyncHandler } from "../../middleware/asyncHandler";
import { HTTPSTATUS } from "../../config/http.config";
import { AuthService } from "../services/admin.dispatcher.service";
import { accountVerifySchema, adminRegisterSchema } from "../validators/admin.dispatcher";



export class AuthController {
    private authService: AuthService;
    
    constructor(authService:AuthService){
        this.authService=authService
    }

    public register = asyncHandler(
        async (req:Request,res:Response):Promise<any>=>{

            // validate the schema
           const body =  adminRegisterSchema.parse({
                ...req.body
            })
            
            // pass it to the auth service
            const {user} = await  this.authService.register(body);
            // return the result

            return res.status(HTTPSTATUS.CREATED).json({
                // user,
                message:"User created successful"
            })
        }
    );

    public verifyVendorAccount = asyncHandler(
        async (req:Request, res:Response): Promise<any>=>{

            const {userId} = accountVerifySchema.parse(req.body);

            await this.authService.verifyVendorAccount({userId})

            return res.status(HTTPSTATUS.OK).json({
                message:"Account verification successful"
            })
        }
    )

    public verifyT3PlAccount = asyncHandler(
        async (req:Request, res:Response): Promise<any>=>{

            const {userId} = accountVerifySchema.parse(req.body);

            await this.authService.verifyT3PlAccount({userId})

            return res.status(HTTPSTATUS.OK).json({
                message:"Account verification successful"
            })
        }
    )

    public verifyAdminAccount = asyncHandler(
        async (req:Request, res:Response): Promise<any>=>{

            const {userId} = accountVerifySchema.parse(req.body);

            await this.authService.verifyAdminDispatcherAccount({userId})

            return res.status(HTTPSTATUS.OK).json({
                message:"Account verification successful"
            })
        }
    )
}