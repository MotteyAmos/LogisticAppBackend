import mongoose, { Date } from "mongoose";
import { auditingAndConfirmation, financialInfo, preference, userProfile } from "./generalTypes";
import { Role, accountStatus } from "../enum/general";


export interface professionalDetails{
    licenceImage:String,
    yearsOfDrivingExperience:Number
}

export interface T3PLTypes extends mongoose.Document{
        userProfile: userProfile,
        financialDetails: financialInfo,
        role: Role,
        status: accountStatus,
        preference: preference,
        auditingAndConfirmation:auditingAndConfirmation,
        professionalDetails:professionalDetails,
        vehicleInfo:{
            vehicleType:String,
            registrationNumber: String
        }
    }

export interface T3PLRegistrationDTO{
    userProfile: userProfile,
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