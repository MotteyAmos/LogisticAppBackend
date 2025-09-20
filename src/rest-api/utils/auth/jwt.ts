import mongoose from "mongoose";
import Jwt, { SignOptions, VerifyOptions } from "jsonwebtoken"
import { appConfig } from "../../config/app.config.ts";
import { Role } from "../../enum/general.ts";


const defaults: SignOptions = {
    audience: ["user"]
}

type SignOptionsAndSeret = SignOptions & {
    secret:string
}

const accessTokenSignOptions: SignOptionsAndSeret = {
    expiresIn:"10Mins" ,
    secret: appConfig.JWT_ACCESS_SECRET
}

export const refreshTokenSignOptions: SignOptionsAndSeret = {
    expiresIn:"5Days",
    secret: appConfig.JWT_REFRESH_SECRET
}

export interface AccessTokenPayloadType {
    userId:mongoose.Types.ObjectId,
    sessionId: mongoose.Types.ObjectId,
    roleId: mongoose.Types.ObjectId,
    UserType:"STAFF"|"VENDOR"|"T3PL"|"RIDER"
}

export interface RefreshTokenPayloadType{
    sessionId: mongoose.Types.ObjectId
}

export const signToken = (
    payload: AccessTokenPayloadType | RefreshTokenPayloadType,
    options?: SignOptionsAndSeret
)=>{
    const {secret, ...signOpt} = options || accessTokenSignOptions;
    return Jwt.sign(payload, secret,{
        ...defaults,
        ...signOpt
    })
}



export const verifyJwtToken = <TPayload extends object = AccessTokenPayloadType>(token:string, options?: VerifyOptions & {secret:string})=>{
    try{
        const {secret = appConfig.JWT_ACCESS_SECRET, ...opts} = options || {}
        const payload = Jwt.verify(token, secret, {
            ...defaults,
             ...opts
        })as TPayload
        return {payload}
    }catch(error:any){
        return {
            error:error?.message
        }
    }
}
