import mongoose from "mongoose"
import { address, auditingAndConfirmation, contactDetails, financialInfo, preference, userProfile } from "./generalTypes"
import { accountStatus, Role } from "../enum/general"
import {z} from "zod"

export interface businessInfo{
    companyName: String,
    businessType: String,
    businessDescription: String,
    webApplicationDomainName: String
}

export interface vendorType extends mongoose.Document{
        businessInfo:businessInfo,
        userProfile: Omit<userProfile,"emergencyInfo"> ,
        financialDetails: financialInfo,
        role: Role,
        status: accountStatus,
        preference: preference,
        auditing:auditingAndConfirmation,
        apiKey: String
    }

export interface vendorRegisterDto{
    businessInfo:businessInfo,
        userProfile: Omit<userProfile,"emergencyInfo"> ,
        financialDetails: financialInfo,
        role: Role,
        status: accountStatus
}
