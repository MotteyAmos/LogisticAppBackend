
import { z } from "zod/v4";
import mongoose from "mongoose"
import { accountVerificationStatus, Gender, Permissions, Role } from "../enum/general.ts"
import { loginSchema } from "../validators/general.ts"





export interface contactDetails{
    phoneNumber?: String,
    email?: String,
    additionalMobileNumber?: String,
    residentialAddress?: String,
    emergency?:emergencyInfo
}

export interface address {
    region: String,
    country: String,
    town: String,
    GPS_Address: String,
    nationalIdentification:{
        type:String,
        value: String
    }
}


export interface emergencyInfo {
    name: String,
    relationship: String,
    phoneNumber: String
}

export interface fullName{
    surname: String,
    firstName: String,
    middleName?: String
}

export interface UpdateFullName{
    surname?: String,
    firstName?: String,
    middleName?: String
}

export interface updateUserProfile {
    fullName?:UpdateFullName,
    gender?: Gender,
    email?: String,
    contact?: String,
    password?: String,
    picture?: String
}

export interface userProfile {
    fullName:fullName,
    gender: Gender,
    email: String,
    contact: String,
    password: String,
    picture?: String
}

export interface financialInfo {
    bankAccountDetails?: {
        bankName:String,
        accountNumber: String,
        recipientName: String
    },
    mobileMoneyAccount?:{
        phoneNumber: String,
        recipientName: String
    }
}

export interface RoleType{
    name: String,
    permissions?: mongoose.Types.ObjectId[]
}

export interface RoleDTO{
    name:String,
    permissions?:String[]
}


export interface PermsissionType{
    name:String,
    description: String
}

export interface UpdatePermsissionDTO{
    id: String,
    name?:String,
    description?: String
}


export interface UpdateRoleDto{
    id:String,
    name?:String,
    permissions?: String[]
}




export interface preference {
    enable2FA:boolean,
    enableEmailNotification: boolean;
    twoFactorSecret: string
}

export interface updatePreference{
     enable2FA?:boolean,
    enableEmailNotification?: boolean
}



export interface auditingAndConfirmation{
    lastLogin:Date,
    accountVerificationStatus: accountVerificationStatus,
    emailVarification:Boolean
}




export interface SessionType{
    userAgent?:String,
    expireAt?: Date,
    createdAt?: Date
}

export type loginDTO = z.infer<typeof loginSchema>

declare global{
    namespace Express{
        interface Request{
            userId:String;
            role: String
        }
    }
}