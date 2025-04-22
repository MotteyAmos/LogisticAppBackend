import { NextFunction,ErrorRequestHandler, Request,Response } from "express";
import {z} from "zod";
import { HTTPSTATUS } from "../config/http.config";
import { AppError } from "../utils/AppError";
import { Jwt , JsonWebTokenError, TokenExpiredError} from "jsonwebtoken";


const formatZodError = (res: Response, error: z.ZodError)=>{
    const errors = error?.issues?.map((err)=>({
        field: err.path.join("."),
        message: err.message
    }))
    return res.status(HTTPSTATUS.BAD_REQUEST).json({
        message: "Validation failed",
        errors: errors
    })
}



export const errorHandler:ErrorRequestHandler = (error,req:Request, res:Response, next:NextFunction):any=>{

    if (process.env.NODE_ENV="development"){
        console.log(error);
    }

    if (error instanceof SyntaxError){
        return res.status(HTTPSTATUS.BAD_REQUEST).json({
            message: "Invalid json format, please check your request body"
        })
    }

    if (error instanceof z.ZodError){
        return formatZodError(res, error);
    }

    if (error instanceof JsonWebTokenError){
        return res.status(HTTPSTATUS.FORBIDDEN).json({
            message:"Access token invalid"
        })
    }

    if (error instanceof TokenExpiredError){
        return res.status(HTTPSTATUS.FORBIDDEN).json({
            message:"Access token expired"
        })
    }

    if (error instanceof AppError){
        return res.status(error.statusCode).json({
            message:error.message,
            errorCode: error?.errorCode
        })
    }

    return res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
        message:"Internal server error",
        error: error?.message || "Unknown error occured"
    })
    // res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).send("Sorry an error occured");
}