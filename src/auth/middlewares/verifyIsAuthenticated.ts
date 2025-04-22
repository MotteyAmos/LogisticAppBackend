import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../../middleware/asyncHandler";
import { UnauthorizedException } from "../../utils/catch-error";
import { HTTPSTATUS } from "../../config/http.config";
import InvalidTokenModel from "../database/models/InvalidTokens";
import { AccessTokenPayloadType, verifyJwtToken } from "../utils/jwt";
import { JwtPayload } from "jsonwebtoken";
import { Role } from "../enum/general";



export const verifyIsAuthenticated = asyncHandler(
    async (req:Request, res:Response,next:NextFunction): Promise<any> =>{

        const accessToken = req.headers?.authorization

        if (!accessToken){
            throw new UnauthorizedException();
        }

        // remember the accesskey can still be valid even after user has logout, we mignt forget to delete it on the brower 
        //  since we are not using cookies store at the backend.
        //  so I'm storing users who have logout accesskey here for security reasons
        const tokenIsInvalid = await InvalidTokenModel.findOne({invalidToken:accessToken})
        
        if (tokenIsInvalid){
            throw new UnauthorizedException()
        }

        const decodeAccessToken = await verifyJwtToken(accessToken) as JwtPayload;
        
        req.userId = decodeAccessToken?.payload?.userId;
        req.role = decodeAccessToken?.payload?.role 
         next()
    }
)