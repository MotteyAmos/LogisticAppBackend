// 3PL = driver or rider

import mongoose, {Schema} from "mongoose";
import { auditingAndConfirmationSchema, financialDetailSchema, preferenceSchema, sessionSchema, userProfileSchema } from "./generalSchema";
import { accountStatus, Role } from "../../enum/general";
import { compareValue, hashValue } from "../../utils/bcryptEn";
import { professionalDetails, T3PLTypes } from "../../types/3pl";

// we wil be using aws s3 bucket, I will change the url later
const licenceImageRootLoc = "https://s3.amazonaws.com/mybucket"


const T3PLSchema = new Schema<T3PLTypes>({
    userProfile: userProfileSchema,
    financialDetails: financialDetailSchema,
    role: {
        type:String,
        enum: Object.values(Role),
        default:Role.T3PL,
        required:true
    },
    status:{
        type:String,
        enum: Object.values(accountStatus),
        default: accountStatus.INACTIVE
    },
    preference: preferenceSchema,
    auditingAndConfirmation:auditingAndConfirmationSchema,
    professionalDetails: new Schema<professionalDetails>({
        licenceImage:{
            type:String,
            get:(v:String) => `${licenceImageRootLoc}${v}`
        },
        yearsOfDrivingExperience:{
            type:Number,
            default:0
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
    collection:"T3PL",
    timestamps:true
})


T3PLSchema.virtual("fullName").get(function(){
    return this.userProfile.fullName + " " + this.userProfile.fullName.middleName + " " + this.userProfile.fullName.firstName
})


T3PLSchema.pre("save", async function(next){
    // let check whether this works
    if (!this.isModified("userProfile.password")){
        next()
    }
    this.userProfile.password = await hashValue(this.userProfile.password);
    next();
});

T3PLSchema.methods.comparePassword = async function (value:string){
    return await compareValue(value, this.userProfile.password);
}



const T3PLModel = mongoose.model<T3PLTypes>("T3PL", T3PLSchema);

export default T3PLModel;