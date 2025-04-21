import mongoose from "mongoose"
import { address, auditingAndConfirmation, contactDetails, financialInfo, preference, SessionType} from "./generalTypes"
import { accountStatus, Role } from "../enum/general"


export interface vendorProfileType {
    contactDetails: contactDetails,
    address: Omit<address, "nationalIdentification">,
    password: String,
    logo?:String,
   
}


export interface businessInfo{
    companyName: String,
    businessType: String,
    businessDescription?: String,
    webApplicationDomainName: String
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
