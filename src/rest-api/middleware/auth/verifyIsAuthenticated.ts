import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../../middleware/asyncHandler.ts";
import { UnauthorizedException } from "../../utils/catch-error.ts";
import { HTTPSTATUS } from "../../config/http.config.ts";
import InvalidTokenModel from "../../../database/models/auth/InvalidTokens.ts";

import { verifyJwtToken } from "../../utils/auth/jwt.ts";
import { JwtPayload } from "jsonwebtoken";
import { Role } from "../../enum/general.ts";
import { getAuthCookies } from "../../utils/auth/cookies.ts";
import { ErrorCode } from "../../enum/errorCode.ts";



export const verifyIsAuthenticated = ()=>asyncHandler(
    async (req:Request, res:Response,next:NextFunction): Promise<any> =>{

        const {accessToken, refreshToken} = getAuthCookies(req);

        if (!accessToken){
            throw new UnauthorizedException("Token expired", ErrorCode.EXPIRED_ACCESS_TOKEN);
        }

        
        const decodeAccessToken =  verifyJwtToken(accessToken) as JwtPayload;
        
        req.userId = decodeAccessToken?.payload?.userId;
        req.userType = decodeAccessToken?.payload?.UserType;

         next()
    }
)