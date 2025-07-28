import { asyncHandler } from "../../middleware/asyncHandler";
import { RiderService } from "../../services/auth/rider.service";
import { Request, Response } from "express";
import {
  approvalStatusSchema,
  riderRegistrationSchema,
} from "../../validators/auth/rider";
import { HTTPSTATUS } from "../../config/http.config";
import { IdSchema } from "../../validators/auth/general";

export class RiderController {
  private riderService: RiderService;

  constructor(riderService: RiderService) {
    this.riderService = riderService;
  }

  public registration = asyncHandler(
    async (req: Request, res: Response): Promise<any> => {
      console.log(req);

      const riderInfo = riderRegistrationSchema.parse({
        userProfile: JSON.parse(req.body.userProfile || "{}"),
        professionalDetails: JSON.parse(req.body.professionalDetails || "{}"),
        contactDetails: JSON.parse(req.body.contactDetails || "{}"),
        vehicleInfo: JSON.parse(req.body.vehicleInfo || "{}"),
        financialDetails: JSON.parse(req.body.financialDetails || "{}"),
      });

      const msg = await this.riderService.registration({ riderInfo, req });

      return res.status(HTTPSTATUS.CREATED).json({
        message: msg,
      });
    }
  );

  public registrationApprovement = asyncHandler(
    async (req: Request, res: Response): Promise<any> => {
      const body = approvalStatusSchema.parse({ ...req.body });

      const msg = await this.riderService.registrationApprovement(body);

      return res.status(HTTPSTATUS.CREATED).json({
        message: msg,
      });
    }
  );

  public deleteRider = asyncHandler(
    async (req: Request, res: Response): Promise<any> => {
      const { id } = req.params;
      const _id = IdSchema.parse(id);

      const message = await this.riderService.deleteRider(_id);
      return res.status(HTTPSTATUS.OK).json({
        message,
      });
    }
  );
}
