import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../../middleware/asyncHandler.ts";
import { UnauthorizedException } from "../../utils/catch-error.ts";
import { Role } from "../enum/general.ts";




export const isAuthorized = (roles:Role[]) =>{
    return asyncHandler(
        async (req:Request, res:Response,next:NextFunction): Promise<any> =>{
    
            const role = req.role;

            if (!roles.includes(role as Role)){
                throw new UnauthorizedException();
            }
             next()
        }
    )
} 
