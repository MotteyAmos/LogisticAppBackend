import { HTTPSTATUS, HttpStatusCode } from "../config/http.config.ts";
import { ErrorCode } from "../enum/errorCode.ts";
import { AppError } from "./AppError.ts";




export class NotFoundException extends AppError{
    constructor(message="Resource not found", errorCode?:ErrorCode){
        super(message, HTTPSTATUS.NOT_FOUND, errorCode || ErrorCode.RESOURCE_NOT_FOUND)
    }
}

export class BadRequestException extends AppError{
    constructor(message="Bad Request", errorCode?:ErrorCode){
        super(message, HTTPSTATUS.BAD_REQUEST,errorCode)
    }
}


export class UnauthorizedException extends AppError{
    constructor(message="Unauthorized Access", errorCode?:ErrorCode){
        super(message, HTTPSTATUS.UNAUTHORIZED,errorCode || ErrorCode.ACCESS_UNAUTHORIZED)
    }
}



export class HttpException extends AppError{

    constructor(
        message = "Http Exception Error",
        statusCode: HttpStatusCode,
        errorCode?: ErrorCode
    ){
        super(message, statusCode, errorCode);
    }
}