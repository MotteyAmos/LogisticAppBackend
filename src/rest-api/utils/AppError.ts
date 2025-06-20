import { HTTPSTATUS, HttpStatusCode } from "../config/http.config.ts";
import { ErrorCode } from "../enum/errorCode.ts";



export class AppError extends Error{
    public readonly statusCode: HttpStatusCode
    public readonly errorCode?: ErrorCode

    constructor(message:string, statusCode=HTTPSTATUS.INTERNAL_SERVER_ERROR,errorCode?:ErrorCode){
        super(message);
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        Error.captureStackTrace(this, this.constructor);
    }
}