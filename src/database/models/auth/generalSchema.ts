import { Schema } from "mongoose";

import { auditingAndConfirmation, contactDetails, emergencyInfo, financialInfo, preference, SessionType, userProfile } from "../../../rest-api/types/auth/generalTypes.ts";
import { accountVerificationStatus, HumanRelationship} from "../../../rest-api/enum/general.ts";
import { sevenDaysFromNow } from "../../../rest-api/utils/date-time.ts";

// we wil be using aws s3 bucket, I will change the url later
export const userProfilePictureRootLoc = "https://s3.amazonaws.com/mybucket"






export const financialDetailSchema = new Schema<financialInfo>({
    bankAccountDetails:{
        bankName:String,
        accountNumber:String,
        recipientName: String
    },
    mobileMoneyAccount:{
        phoneNumber:String,
        recipientName:String
    }
},{_id:false})


export const preferenceSchema = new Schema<preference>({
    enable2FA:{
        type:Boolean,
        default:false
    },
    enableEmailNotification:{
        type:Boolean,
        default:false
    },
    twoFactorSecret:{
        type:String,
        default:""
    }
},{_id:false})


export const auditingAndConfirmationSchema = new Schema<auditingAndConfirmation>({
    lastLogin:{
        type:Date,
        default: Date.now
    },
    accountVerificationStatus:{
        type:String,
        enum: Object.values(accountVerificationStatus),
        default: accountVerificationStatus.PENDING
    },
    emailVarification:{
        type:Boolean,
        default: false
    },
    numberOfOtpVerificationTry:{
        type:Number,
        default:0
    }
})

export const sessionSchema = new Schema<SessionType>({
    userAgent:{
     type:String,
     default:""
    },
    createdAt:{
     type:Date,
     default: Date.now
    },
    expireAt:{
     type:Date,
     required:true,
     default: sevenDaysFromNow
    }
 },{_id:false})


export const contactDetailsSchema = new Schema<contactDetails>({
    phoneNumber:{
        type:String,
        trim:true
    },
    email:{
        type:String,
        trim:true,
        unique:true
    },
    additionalMobileNumber:{
        type:String,
        trim:true
    },
    residentialAddress:{
        type:String,
        trim:true
    },
    emergency: new Schema<emergencyInfo>({
        name:{
            type:String,
            trim:true
        },
        relationship:{
            type:String,
            enum: Object.values(HumanRelationship)
        },
        phoneNumber:{
            type:String,
            trim:true
        }
    })
})