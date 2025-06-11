import { Request, Response } from "express";
import { asyncHandler } from "../../middleware/asyncHandler.ts";
import { HTTPSTATUS } from "../../config/http.config.ts";
import { GeneralAuthService } from "../services/general.service.ts";
import {
  loginSchema,
  PermissionId,
  permissionSchema,
  roleId,
  roleSchema,
  updatePermissionSchema,
  updateRoleSchema,
} from "../validators/general.ts";
import { UnauthorizedException } from "../../utils/catch-error.ts";
import RoleModel from "../../../database/models/auth/RoleModel.ts";

// this contorller will handle requests from all users

export class GeneralAuthController {
  private authService: GeneralAuthService;

  constructor(authService: GeneralAuthService) {
    this.authService = authService;
  }

  public createPermission = asyncHandler(
    async (req: Request, res: Response): Promise<any> => {
      const body = permissionSchema.parse({
        ...req.body,
      });

      const role = await this.authService.createPermssion(body);

      return res.status(HTTPSTATUS.CREATED).json({
        // role,
        message: "Permission created successful",
      });
    }
  );

  public updatePermission = asyncHandler(
    async (req: Request, res: Response): Promise<any> => {
      const body = updatePermissionSchema.parse({
        ...req.body,
      });

      const permission = await this.authService.updatePermission(body);

      return res.status(HTTPSTATUS.CREATED).json({
        // role,
        message: permission.message,
      });
    }
  );

  public deletePermission = asyncHandler(
    async (req: Request, res: Response): Promise<any> => {
      const { id } = req.params;
      const _id = PermissionId.parse(id);

      const message = await this.authService.deletePermission(_id);

      return res.status(HTTPSTATUS.OK).json({
        message,
      });
    }
  );

  public createRole = asyncHandler(
    async (req: Request, res: Response): Promise<any> => {
      // validate the schema
      const body = roleSchema.parse({
        ...req.body,
      });

      const role = await this.authService.createRole(body);

      return res.status(HTTPSTATUS.CREATED).json({
        // role,
        message: "Role created successful",
      });
    }
  );

  public getRoles = asyncHandler(
    async (req: Request, res: Response): Promise<any> => {
      const roles = await RoleModel.find({}).populate("permissions").exec();
      return res.status(HTTPSTATUS.OK).json({
        roles
      });
    }
  );

  public updateRole = asyncHandler(
    async (req: Request, res: Response): Promise<any> => {
      const body = updateRoleSchema.parse({ ...req.body });

      const { message } = await this.authService.updateRole(body);

      return res.status(HTTPSTATUS.OK).json({
        message,
      });
    }
  );

  public deleteRole = asyncHandler(
    async (req: Request, res: Response): Promise<any> => {
      const { id } = req.params;
      const _id = roleId.parse(id);

      const message = await this.authService.deleteRole(_id);

      return res.status(HTTPSTATUS.OK).json({
        message,
      });
    }
  );

  // public login = asyncHandler(
  //     async (req:Request, res:Response): Promise<any>=>{
  //         const userAgent = req.headers["user-agent"];

  //         const body = loginSchema.parse({...req.body,userAgent})

  //         const {accessToken,refreshToken,user} = await this.authService.login(body)

  //         return res.status(HTTPSTATUS.OK).json({
  //             accessToken,
  //             refreshToken,
  //             user,
  //             message:"User Login Successuful"
  //         })
  //     }
  // )

  // public refreshToken = asyncHandler(
  //     async (req:Request, res:Response):Promise<any> =>{
  //         const refreshToken = req.headers["refresh-token"]

  //         if (!refreshToken){
  //             throw new UnauthorizedException("The refresh token is empty");
  //         }

  //         const {accessToken, newRefreshToken} = await this.authService.refreshToken(refreshToken as string);

  //         return res.status(HTTPSTATUS.OK).json({
  //             message:"Access token refresh successful",
  //             accessToken: accessToken,
  //             refreshToken: newRefreshToken || undefined
  //         })

  //     }
  // )
}
