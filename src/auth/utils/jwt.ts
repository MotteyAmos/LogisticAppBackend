import mongoose from "mongoose";
import { SignOptions, VerifyOptions } from "jsonwebtoken"
import { appConfig } from "../../config/app.config";
import  Jwt  from "jsonwebtoken";

const defaults: SignOptions = {
    audience: ["user"]
}

type SignOptionsAndSeret = SignOptions & {
    secret:string
}

const accessTokenSignOptions: SignOptionsAndSeret = {
    expiresIn:"15Mins" ,
    secret: appConfig.JWT_ACCESS_SECRET
}

export const refreshTokenSignOptions: SignOptionsAndSeret = {
    expiresIn:"5Days",
    secret: appConfig.JWT_REFRESH_SECRET
}

export interface AccessTokenPayloadType {
    userId:mongoose.Types.ObjectId,
    sessionId: mongoose.Types.ObjectId
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

