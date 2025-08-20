import { NextFunction, Request, Response } from "express";
import { getAuthCookies } from "../../utils/auth/cookies";
import { UnauthorizedException } from "../../utils/catch-error";
import { ErrorCode } from "../../enum/errorCode";
import { RefreshTokenPayloadType, verifyJwtToken } from "../../utils/auth/jwt";
import { appConfig } from "../../config/app.config";
import { JwtPayload } from "jsonwebtoken";
import RoleModel from "../../../database/models/auth/RoleModel";




export const canCreateStaff = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const create_staff_permissionID_value = "689b716f75819fdee8a17fca";

    const { accessToken } = getAuthCookies(req);
    
    if (!accessToken) {
      throw new UnauthorizedException(
        "Expired access token",
        ErrorCode.EXPIRED_ACCESS_TOKEN
      );
    }

    const { payload } = verifyJwtToken<RefreshTokenPayloadType>(accessToken, {
      secret: appConfig.JWT_ACCESS_SECRET,
    }) as JwtPayload;

    if (!payload?.roleId) {
      throw new UnauthorizedException(
        "Expired access token",
        ErrorCode.EXPIRED_ACCESS_TOKEN
      );
    }

  
    const hasPermission = await RoleModel.findOne({
      _id: payload.roleId,
      permissions: { $all: [create_staff_permissionID_value] },
    }).lean();

    
    if (!hasPermission) {
  
      throw new UnauthorizedException(
        "You are not authorized to access this resource",
        ErrorCode.EXPIRED_ACCESS_TOKEN
      );
    }

    next();
  };
};
