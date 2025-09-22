import { Request, Response } from "express";
import { asyncHandler } from "../../middleware/asyncHandler.ts";
import { HTTPSTATUS } from "../../config/http.config.ts";
import { GeneralAuthService } from "../../services/auth/general.service.ts";
import {
  emailSchema,
  forgotPasswordSchema,
  loginSchema,
  OTPSchema,
  PermissionId,
  permissionSchema,
  roleId,
  roleSchema,
  updatePermissionSchema,
  updateRoleSchema,
} from "../../validators/auth/general.ts";
import { UnauthorizedException } from "../../utils/catch-error.ts";
import RoleModel from "../../../database/models/auth/RoleModel.ts";
import {
  clearAuthCookies,
  getAuthCookies,
  setAuthCookies,
} from "../../utils/auth/cookies.ts";
import { ErrorCode } from "../../enum/errorCode.ts";


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
        roles,
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

  public login = asyncHandler(
    async (req: Request, res: Response): Promise<any> => {
      const userAgent = req.headers["user-agent"];

      const body = loginSchema.parse({ ...req.body, userAgent });

      const { accessToken, refreshToken, user ,viewAbleTabs} = await this.authService.login(body);
     
      return setAuthCookies({ res, accessToken, refreshToken })
        .status(HTTPSTATUS.OK)
        .json({
          viewAbleTabs,
           accessToken,
           refreshToken,
          user,
          message: "Login Successuful",
        });
    }
  );

  public refreshToken = asyncHandler(
    async (req: Request, res: Response): Promise<any> => {
      // console.log( "my cooo" ,req)
      const token= getAuthCookies(req);

    
      if (!token.refreshToken) {
      

        throw new UnauthorizedException("Token expired, Please relogin!!!", ErrorCode.EXPIRED_REFRESH_TOKEN);
        // "The refresh token is empty"
      }

      const { accessToken, newRefreshToken } =
        await this.authService.refreshToken(token.refreshToken as string);

      return setAuthCookies({
        res,
        accessToken,
        refreshToken: newRefreshToken as String,
      })
        .status(HTTPSTATUS.OK)
        .json({
          message: "token refresh successful",
          //   accessToken: accessToken,
          //   refreshToken: newRefreshToken || undefined
        });
    }
  );

  public logout = asyncHandler(
    async (req: Request, res: Response): Promise<any> => {
      await this.authService.logout(req);
      
      return clearAuthCookies(res).status(HTTPSTATUS.OK).json({
        message: "Logout successful",
      });
    }
  );

  public forgotPassword = asyncHandler(
    async (req: Request, res: Response): Promise<any> => {
      const body = forgotPasswordSchema.parse(req.body);

      const message = await this.authService.forgotPassword(body);

      return res.status(HTTPSTATUS.OK).json({ message });
    }
  );

  public verifyOTP = asyncHandler(
    async (req: Request, res: Response): Promise<any> => {
      const userAgent = req.headers["user-agent"];
      const body = OTPSchema.parse({ ...req.body, userAgent });

      const { message, accessToken, refreshToken, user } =
        await this.authService.verifyOTP(body);

      return setAuthCookies({ res, accessToken, refreshToken })
        .status(HTTPSTATUS.OK)
        .json({
          user,
          message
        });
    }
  );

  //   public handleEmailEvent = asyncHandler(
  //     async (req:Request, res:Response):Promise<any> =>{
  //         const body = req.body.json()

  //         const mesg = this.authService.handleEmailEvent(body);

  //     }
  //   )
}
