// 3PL = driver or rider

import mongoose, {Schema} from "mongoose";
import { auditingAndConfirmationSchema,  financialDetailSchema, preferenceSchema } from "./generalSchema";
import {RiderContactDetails, RiderPersonalInfo, RiderProfessionalDetails, RiderType } from "../../../rest-api/types/auth/rider";
import { accountStatus, Gender, Role } from "../../../rest-api/enum/general";
import { compareValue, hashValue } from "../../../rest-api/utils/auth/bcryptEn";


const userProfileSchema = new Schema<RiderPersonalInfo>({
    fullName:{
        type:String,
        required:true,
        trim:true
    },
    gender: {
        type:String,
        enum: Object.values(Gender),
        required:true,
        default:Gender.MALE
    },
    dateOfBirth:{
        type:Date
    },
    password:{
        type:String,
        trim:true
    },
    picture:{
        type:String,
        trim:true
    },
    nationalIdentification: new Schema({
        // type of nation identification card eg. voter's id, GH-card etc
        type:String,
        // id value or number
        number:String,
        image: {
            type:String
        }
    },{_id:false}),
},{_id:false})

const contactDetailsSchema = new Schema<RiderContactDetails>({
    phoneNumber:{
        type:String,
        trim:true,
        requied:true
    },
    additionalPhoneNumber:{
        type:String,
        trim:true
    },
    email: {
        type:String,
        trim:true,
        required:true
    },
    residentailAddress:{
        type:String,
        trim:true
    },
    emergencyContactName:{
        type:String,
        trim:true
    },
    emergencyContactNumber:{
        type:String,
        trim:true
    }
},{_id:false})

const RiderSchema = new Schema<RiderType>({
    userProfile: userProfileSchema,
    contactDetails:contactDetailsSchema,
    financialDetails: financialDetailSchema,
    role: {
        type:String,
        enum: Object.values(Role),
        default:Role.RIDER,
    },
    status:{
        type:String,
        enum: Object.values(accountStatus),
        default: accountStatus.INACTIVE
    },
    preference: preferenceSchema,
    auditingAndConfirmation:auditingAndConfirmationSchema,
    professionalDetails: new Schema<RiderProfessionalDetails>({
        drivingLicenseImg:{
            type:String,
        },
        yearsOfDrivingExperience:{
            type:Number,
            default:0
        },
        driverLicenseNumber:{
            type:String
        }
    },{_id:false}),
    vehicleInfo:{
        vehicleType:String,
        registrationNumber:String
        
    }
    
},{
    toJSON: {
        virtuals:true,
        transform(doc,ret){
            delete ret.userProfile.password
            delete ret.preference?.twoFactorSecret
            return ret
        },
        getters:true
    },
    toObject:{
        transform(doc,ret){
            delete ret.userProfile.password
            delete ret.preference?.twoFactorSecret
            return ret
        },
        virtuals: true,
        getters: true
    },
    collection:"Riders",
    timestamps:true
})




RiderSchema.pre("save", async function(next){
  
    if (!this.isModified("userProfile.password")){
        next()
    }
    this.userProfile.password = await hashValue(this.userProfile.password);
    next();
});

RiderSchema.methods.comparePassword = async function (value:string){
   
    return await compareValue(value, this.userProfile.password);
}



const RiderModel = mongoose.model<RiderType>("Rider", RiderSchema);

export default RiderModel;