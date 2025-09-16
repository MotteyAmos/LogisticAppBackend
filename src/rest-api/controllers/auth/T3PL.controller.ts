import { Request, Response } from "express";
import { asyncHandler } from "../../middleware/asyncHandler.ts";
import { HTTPSTATUS } from "../../config/http.config.ts";
import { vendorRegisterSchema } from "../../validators/auth/vendor.ts";
import { VendorAuthService } from "../../services/auth/vendor.service.ts";
import { approvalStatusSchema } from "../../validators/auth/rider.ts";
import { IdSchema } from "../../validators/auth/general.ts";
import { T3PLAuthService } from "../../services/auth/T3PLs.service.ts";
import { T3plRegisterSchema } from "../../validators/auth/T3PL.ts";

export class T3PLAuthController {
  private T3plService: T3PLAuthService ;

  constructor(authService: T3PLAuthService) {
    this.T3plService= authService;
  }

  public register = asyncHandler(
    async (req: Request, res: Response): Promise<any> => {
      
          
      const body = T3plRegisterSchema.parse({
        businessInfo: JSON.parse(req.body.businessInfo || "{}"),
        contactDetails:  JSON.parse(req.body.contactDetails || "{}"),
        financialDetails: JSON.parse(req.body.financialDetails || "{}"),
      });


      // const msg = await this.T3plService.register({ req, body });

      return res.status(HTTPSTATUS.CREATED).json({
        // user,
        message: msg,
      });
    }
  );

  public registrationApprovement = asyncHandler(
    async (req: Request, res: Response): Promise<any> => {
      const body = approvalStatusSchema.parse({ ...req.body });

      const msg = await this.T3plService.registrationApprovement(body);

      return res.status(HTTPSTATUS.OK).json({
        message: msg,
      });
    }
  );

    public deleteVendor = asyncHandler(
      async (req: Request, res: Response): Promise<any> => {
        const { id } = req.params;
        const _id = IdSchema.parse(id);
    
        const message = await this.T3plService.delete3PL(_id)
        return res.status(HTTPSTATUS.OK).json({
          message,
        });
      }
    );
  
}
