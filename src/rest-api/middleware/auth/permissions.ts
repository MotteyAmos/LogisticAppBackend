import { NextFunction, Request, Response } from "express";
import { getAuthCookies } from "../../utils/auth/cookies";
import { UnauthorizedException } from "../../utils/catch-error";
import { ErrorCode } from "../../enum/errorCode";
import { RefreshTokenPayloadType, verifyJwtToken } from "../../utils/auth/jwt";
import { appConfig } from "../../config/app.config";
import { JwtPayload } from "jsonwebtoken";
import RoleModel from "../../../database/models/auth/RoleModel";




export const canCreateRole = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const create_role_permissionID_value = "686c105ddab000c00a555367";

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

    const hasPermission = await RoleModel.find({
      _id: payload.roleId,
      permissions: { $in: [create_role_permissionID_value] },
    }).lean();

    if (!hasPermission) {
      console.log("has no permission-------------------");
      throw new UnauthorizedException(
        "Expired access token",
        ErrorCode.EXPIRED_ACCESS_TOKEN
      );
    }

    console.log("has permsission----------------------");

    next();
  };
};
