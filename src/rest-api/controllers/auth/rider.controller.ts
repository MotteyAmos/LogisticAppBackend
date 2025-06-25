import { asyncHandler } from "../../middleware/asyncHandler";
import { RiderService } from "../../services/auth/rider.service";
import { Request, Response } from "express";
import { approvalStatusSchema, riderRegistrationSchema } from "../../validators/auth/rider";
import { HTTPSTATUS } from "../../config/http.config";





export class RiderController{
   private riderService: RiderService;


   constructor(riderService: RiderService){
    this.riderService = riderService;
   }

   public registration = asyncHandler(
    async (req:Request, res:Response): Promise<any>=>{
        
        const riderInfo = riderRegistrationSchema.parse({...JSON.parse(req?.body.data)});

        const msg = await this.riderService.registration({riderInfo, req})

        return res.status(HTTPSTATUS.CREATED).json({   
              message: msg
              });


    }
   );

   public registrationApprovement = asyncHandler(
      async (req:Request, res:Response): Promise<any>=>{
            const body = approvalStatusSchema.parse({...req.body})

            const msg = await this.riderService.registrationApprovement(body);

            return res.status(HTTPSTATUS.CREATED).json({   
              message: msg
              });
      }
   )
}






