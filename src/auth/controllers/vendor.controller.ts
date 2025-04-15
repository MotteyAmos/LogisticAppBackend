import { Request, Response } from "express";
import { asyncHandler } from "../../middleware/asyncHandler";
import { HTTPSTATUS } from "../../config/http.config";
import { AuthService } from "../services/admin.dispatcher.service";
import { vendorRegisterSchema } from "../validators/vendor";
import { VendorAuthService } from "../services/vendor.service";



export class VendorAuthController {
    private authService: VendorAuthService;
    
    constructor(authService:VendorAuthService){
        this.authService=authService
    }

    public register = asyncHandler(
        async (req:Request,res:Response):Promise<any>=>{

            // validate the schema
           const body =  vendorRegisterSchema.parse({
                ...req.body
            })
            
            // pass it to the auth service
            const {user} = await  this.authService.register(body);
            // return the result

            return res.status(HTTPSTATUS.CREATED).json({
                // user,
                message:"Vendor created successful"
            })
        }
    );
}