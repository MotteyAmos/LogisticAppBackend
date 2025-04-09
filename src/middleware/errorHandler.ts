import { NextFunction,ErrorRequestHandler, Request,Response } from "express";
// import { HTTPSTATUS } from " ../";


export const errorHandler = (error:ErrorRequestHandler,req:Request, res:Response, next:NextFunction)=>{


    console.log(error)


    // res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).send("Sorry an error occured");
}