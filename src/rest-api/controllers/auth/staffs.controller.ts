import { Request, Response } from "express";
import { asyncHandler } from "../../middleware/asyncHandler.ts";
import { HTTPSTATUS } from "../../config/http.config.ts";
import {
  accountVerifySchema,
  staffsRegisterSchema,
  updateStaffSchema,
} from "../../validators/auth/staffs.ts";
import { AuthService } from "../../services/auth/staffs.service.ts";
import StaffModel from "../../../database/models/auth/staffs.Model.ts";
import { staffId } from "../../validators/auth/general.ts";

export class AuthController {
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  public register = asyncHandler(
    async (req: Request, res: Response): Promise<any> => {
      // validate the schema
      const body = staffsRegisterSchema.parse({
        ...req.body,
      });

      
   

      // pass it to the auth service
      const { user } = await this.authService.registerStaff(body);
      // return the result


      return res.status(HTTPSTATUS.CREATED).json({
        // user,
        message: "User created successfully",
      });
    }
  );

 
  public updateStaff = asyncHandler(
    async (req:Request, res:Response): Promise<any> =>{
         const body = updateStaffSchema.parse({
        ...req.body,
      });

      const {message} = await this.authService.updateStaff(body);

       return res.status(HTTPSTATUS.OK).json({
       
        message
      });

    }
  )

  public deleteStaff = asyncHandler(
    async (req:Request, res:Response): Promise<any> =>{
        const {id} = req.params;

        
        const _id = staffId.parse(id)

        const message = await this.authService.deleteStaff(_id)

        return res.status(HTTPSTATUS.OK).json({
                message,
              });
    }
  )


  
  // public verifyVendorAccount = asyncHandler(
  //     async (req:Request, res:Response): Promise<any>=>{

  //         const {userId} = accountVerifySchema.parse(req.body);

  //         await this.authService.verifyVendorAccount({userId})

  //         return res.status(HTTPSTATUS.OK).json({
  //             message:"Account verification successful"
  //         })
  //     }
  // )

  // public verifyT3PlAccount = asyncHandler(
  //     async (req:Request, res:Response): Promise<any>=>{

  //         const {userId} = accountVerifySchema.parse(req.body);

  //         await this.authService.verifyT3PlAccount({userId})

  //         return res.status(HTTPSTATUS.OK).json({
  //             message:"Account verification successful"
  //         })
  //     }
  // )

  // public verifyAdminAccount = asyncHandler(
  //     async (req:Request, res:Response): Promise<any>=>{

  //         const {userId} = accountVerifySchema.parse(req.body);

  //         await this.authService.verifyAdminDispatcherAccount({userId})

  //         return res.status(HTTPSTATUS.OK).json({
  //             message:"Account verification successful"
  //         })
  //     }
  // )
}
