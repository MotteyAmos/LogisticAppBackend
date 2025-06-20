import { Request, Response } from "express";
import { asyncHandler } from "../../middleware/asyncHandler.ts";
import { HTTPSTATUS } from "../../config/http.config.ts";
import { vendorRegisterSchema } from "../../validators/auth/vendor.ts";
import { VendorAuthService } from "../../services/auth/vendor.service.ts";


export class VendorAuthController {
    private vendorService: VendorAuthService;
    
    constructor(authService:VendorAuthService){
        this.vendorService=authService
    }

    public register = asyncHandler(
        async (req:Request,res:Response):Promise<any>=>{

           const body =  vendorRegisterSchema.parse({
                ...req.body
            })
            
            const {vendor} = await  this.vendorService.register(body);
           

            return res.status(HTTPSTATUS.CREATED).json({
                // user,
                message:"Account created successful",
             
            })
        }
    );


    
}