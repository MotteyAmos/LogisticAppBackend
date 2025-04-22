import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../../middleware/asyncHandler";
import { UnauthorizedException } from "../../utils/catch-error";
import { HTTPSTATUS } from "../../config/http.config";
import InvalidTokenModel from "../database/models/InvalidTokens";
import { verifyJwtToken } from "../utils/jwt";



export const verifyIsAuthenticated = asyncHandler(
    async (req:Request, res:Response,next:NextFunction): Promise<any> =>{

        const accessToken = req.headers?.authorization

        if (!accessToken){
            throw new UnauthorizedException();
        }

        const tokenIsInvalid = await InvalidTokenModel.findOne({invalidToken:accessToken})
        
        if (tokenIsInvalid){
            throw new UnauthorizedException()
        }

        const decodeAccessToken = await verifyJwtToken(accessToken);
        
        req.userId = decodeAccessToken.payload as String
         next()
    }
)