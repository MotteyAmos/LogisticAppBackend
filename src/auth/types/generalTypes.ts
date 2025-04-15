
import { Schema } from "mongoose"
import { accountVerificationStatus } from "../enum/general"

export interface fullName{
    surname: String,
    firstName: String,
    middleName: String
}


export interface contactDetails{
    phoneNumber: String,
    email: String
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
    phoneNunber: String
}


export interface userProfile {
    fullName:fullName,
    contactDetails: contactDetails,
    address: address,
    emergencyInfo: emergencyInfo,
    password: String,
    picture: String
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



export interface preference {
    enable2FA:boolean,
    enableEmailNotification: boolean;
    twoFactorSecret: string
}


export interface auditingAndConfirmation{
    lastLogin:Date,
    accountVerificationStatus: accountVerificationStatus,
    emailVarification:Boolean
}



