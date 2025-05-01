import mongoose from "mongoose"
import { address, auditingAndConfirmation, contactDetails, financialInfo, preference, SessionType} from "./generalTypes"
import { accountStatus, Role } from "../enum/general"


export interface vendorProfileType {
    contactDetails:{
        name:String,
        email:String,
        phoneNumber:String
    }
    password: String,
    logo?:String,
   
}


export interface businessInfo{
    companyName: String,
    businessType: String,
    businessDescription?: String,
    webApplicationDomainName: String,
    businessAddress?:String,
    businessRegistrationNumber?:String,
    countryAndCity?: String
}

export interface vendorType extends mongoose.Document{
        businessInfo:businessInfo,
        userProfile: vendorProfileType ,
        financialDetails: financialInfo,
        role: Role,
        status: accountStatus,
        preference: preference,
        auditing:auditingAndConfirmation,
        apiKey: String,
        comparePassword(value:String): Promise<Boolean>
    }

export interface vendorRegisterDto{
        businessInfo:businessInfo,
        userProfile: vendorProfileType ,
        financialDetails: financialInfo,
      
}
