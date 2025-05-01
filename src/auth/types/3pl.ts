import mongoose, { Date } from "mongoose";
import { auditingAndConfirmation, contactDetails, financialInfo, preference, SessionType, userProfile } from "./generalTypes";
import { Gender, Role, accountStatus } from "../enum/general";


export interface professionalDetails{
    licenceImage:String,
    yearsOfDrivingExperience:Number
}

export interface T3PlPersonalInfo{
    fullName: String,
    gender: Gender,
    dateOfBirth: Date,
    nationalIdentification:{
        type:String,
        number: String,
        image: String
    }
    driverLicenseNumber:String,
    password:String
}

export interface T3PLTypes extends mongoose.Document{
        userProfile: T3PlPersonalInfo,
        contactDetails: contactDetails,
        vehicleInfo:{
            vehicleType:String,
            registrationNumber: String
        },
        // branch:
        financialDetails: financialInfo,
        role: Role,
        status: accountStatus,
        preference: preference,
        auditingAndConfirmation:auditingAndConfirmation,
        professionalDetails:professionalDetails,
       
        comparePassword(value:String): Promise<Boolean>

    }

export interface T3PLRegistrationDTO{
    userProfile: T3PlPersonalInfo,
        financialDetails:  financialInfo,
        professionalDetails:{
            licenceImage:String,
            yearsOfDrivingExperience:Number
        },
        vehicleInfo:{
            vehicleType:String,
            registrationNumber: String
        }
}