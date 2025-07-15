import { CookieOptions, Response,Request } from "express";
import { sevenDaysFromNow, tenMinutesFromNow } from "../../utils/date-time";

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
  return res.clearCookie("guardsbyxgs").clearCookie("edstscsite", {
    path: "/",
    domain:process.env.APP_ORIGIN,
    sameSite:'lax',
    secure
  });
};


export const getAuthCookies = (req:Request)=>{
    const accessToken= req.cookies["guardsbyxgs"]
    const refreshToken = req.cookies["edstscsite"]


    return {
        accessToken,
        refreshToken
    }
}
