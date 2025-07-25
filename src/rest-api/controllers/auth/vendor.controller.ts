import { Request, Response } from "express";
import { asyncHandler } from "../../middleware/asyncHandler.ts";
import { HTTPSTATUS } from "../../config/http.config.ts";
import { vendorRegisterSchema } from "../../validators/auth/vendor.ts";
import { VendorAuthService } from "../../services/auth/vendor.service.ts";
import { approvalStatusSchema } from "../../validators/auth/rider.ts";

export class VendorAuthController {
  private vendorService: VendorAuthService;

  constructor(authService: VendorAuthService) {
    this.vendorService = authService;
  }

  public register = asyncHandler(
    async (req: Request, res: Response): Promise<any> => {
      
      
      
      const body = vendorRegisterSchema.parse({
        businessInfo: JSON.parse(req.body.businessInfo || "{}"),
        contactDetails:  JSON.parse(req.body.contactDetails || "{}"),
        financialDetails: JSON.parse(req.body.financialDetails || "{}"),
      });


      const msg = await this.vendorService.register({ req, body });

      return res.status(HTTPSTATUS.CREATED).json({
        // user,
        message: msg,
      });
    }
  );

  public registrationApprovement = asyncHandler(
    async (req: Request, res: Response): Promise<any> => {
      const body = approvalStatusSchema.parse({ ...req.body });

      const msg = await this.vendorService.registrationApprovement(body);

      return res.status(HTTPSTATUS.OK).json({
        message: msg,
      });
    }
  );
}
