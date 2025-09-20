import { CookieOptions, Response,Request } from "express";
import { sevenDaysFromNow, tenMinutesFromNow } from "../../utils/date-time";
import { appConfig } from "../../config/app.config";
import { UnauthorizedException } from "../catch-error";
import { ErrorCode } from "../../enum/errorCode";
import { verifyJwtToken } from "./jwt";

const secure = process.env.NODE_ENV == "production";

const defaults: CookieOptions = {
  sameSite: "lax",
  httpOnly: true,
  secure,
};

export const getAccessTokenCookieOptions = (): CookieOptions => ({
  ...defaults,
  expires: tenMinutesFromNow(),
});

export const getRefreshTokenCookieOptions = (): CookieOptions => ({
  ...defaults,
  expires: sevenDaysFromNow(),
});

type Params = {
  res: Response;
  accessToken: String ;
  refreshToken: String ;
};


export const setAuthCookies = ({ res, accessToken, refreshToken }: Params) => {
  
  return res
    .cookie("guardsbyxgs", accessToken, getAccessTokenCookieOptions())
    .cookie("edstscsite", refreshToken, getRefreshTokenCookieOptions());
};

export const clearAuthCookies = (res: Response) => {
    const cookieOptions = {
    sameSite: "lax" as const,
    secure: true,
  };

  return res
    .clearCookie("guardsbyxgs", cookieOptions)
    .clearCookie("edstscsite", cookieOptions);
};


export const getAuthCookies = (req:Request)=>{
    const accessToken= req.cookies["guardsbyxgs"]
    const refreshToken = req.cookies["edstscsite"]


    return {
        accessToken,
        refreshToken
    }
}


export const getPayloadFromAccessToken = (req:Request)=>{
  const {accessToken} = getAuthCookies(req);

  if (!accessToken){
    throw new UnauthorizedException("Expired access token", ErrorCode.EXPIRED_ACCESS_TOKEN)
  }

  const {payload} = verifyJwtToken(accessToken);

  if (!payload){
    throw new UnauthorizedException("Expired access token", ErrorCode.EXPIRED_ACCESS_TOKEN)
  }

  return payload;
}