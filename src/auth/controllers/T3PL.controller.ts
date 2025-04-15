import { Request, Response } from "express";
import { asyncHandler } from "../../middleware/asyncHandler";
import { HTTPSTATUS } from "../../config/http.config";
import { T3PLAuthService } from "../services/T3Pls.service";
import { T3PLRegisterSchema } from "../validators/T3PL";



export class T3PLAuthController {
    private authService: T3PLAuthService;
    
    constructor(authService:T3PLAuthService){
        this.authService=authService
    }

    public register = asyncHandler(
        async (req:Request,res:Response):Promise<any>=>{

            // validate the schema
           const body =  T3PLRegisterSchema.parse({
                ...req.body
            })
            
            // pass it to the auth service
            const {user} = await  this.authService.register(body);
            // return the result

            return res.status(HTTPSTATUS.CREATED).json({
                // user,
                message:"3PL created successful"
            })
        }
    );
}