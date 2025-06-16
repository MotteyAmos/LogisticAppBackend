import { NextFunction,ErrorRequestHandler, Request,Response } from "express";
import {z} from "zod";
import { HTTPSTATUS } from "../config/http.config.ts";
import { AppError } from "../utils/AppError.ts";
import jw from 'jsonwebtoken';
const { JsonWebTokenError, TokenExpiredError } = jw;



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



export const errorHandler:ErrorRequestHandler = (error: Error,req:Request, res:Response, next:NextFunction):any=>{

    if (process.env.NODE_ENV="development"){
        console.log(error.message);
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

    //  if (error ) {


    //  }

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


// function handleResendError(error: ResendError, res:Response) {
 
//     switch (error.statusCode) {
//       case HTTPSTATUS.BAD_REQUEST:
//         return res.status(HTTPSTATUS.BAD_REQUEST).json({
//           message: error?.cause?.error?.message || 'Invalid request to Resend',
//         });

//       case HTTPSTATUS.UNAUTHORIZED:
//         return res.status(HTTPSTATUS.UNAUTHORIZED).json({
//           message: 'Unauthorized – check your Resend API key',
//         });

//       case HTTPSTATUS.FORBIDDEN:
//         return res.status(HTTPSTATUS.FORBIDDEN).json({
//           message: 'Forbidden – possibly sending from an unverified domain',
//         });

//       case HTTPSTATUS.INTERNAL_SERVER_ERROR:
//       default:
//         return res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
//           message: 'Resend server error – try again later',
//         });
//     }
  
//   // Not a ResendError — fall back to default or let another handler catch it
//   return res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
//     message: 'An unexpected error occurred',
//   });
// }
// 🧪 Usage Example in a Route:
// js
// Copy
// Edit
// app.post('/send-email', async (req, res) => {
//   try {
//     const data = await resend.emails.send({
//       from: 'noreply@yourdomain.com',
//       to: req.body.to,
//       subject: 'Welcome!',
//       html: '<p>Hello!</p>',
//     });

//     return res.status(200).json({ message: 'Email sent successfully', data });
//   } catch (error) {
//     return handleResendError(error, res);
//   }
// });