
import { z } from "zod/v4";
import mongoose from "mongoose"
import { accountVerificationStatus, ApproveStatus, Gender, Permissions, Role } from "../../enum/general.ts"
import { loginSchema } from "../../validators/auth/general.ts";


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
    description?: String,
    assignTo?: mongoose.Types.ObjectId[]
    permissions?: mongoose.Types.ObjectId[]
}

export interface RoleDTO{
    name:String,
    description?:String,
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
    description?:String,
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
    emailVarification:Boolean,
    numberOfOtpVerificationTry: number
}




export interface SessionType{
    userAgent?:String,
    expireAt?: Date,
    createdAt?: Date
}

export interface loginDTO{
    email:String,
    password: String,
    role: "STAFF"|"VENDOR"|"T3PL"|"RIDER",
    userAgent?: String
}


export interface forgotPasswordDTO{
    email:String,
    role: "STAFF"|"VENDOR"|"T3PL",

}

export interface verifyOtpDTO{
    email:String,
    role: "STAFF"|"VENDOR"|"T3PL",
    otpCode: String,
    password: String,
    userAgent?:String
}

export interface ApprovalStatusDTO{
    id: String,
    status: ApproveStatus
}



declare global{
    namespace Express{
        interface Request{
            userId:String;
            role: String,
            invalidFiles:String[]
            
           
        }
    }
}