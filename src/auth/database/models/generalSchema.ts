import { Schema } from "mongoose";
import { auditingAndConfirmation, financialInfo, preference, userProfile } from "../../types/generalTypes";
import { accountVerificationStatus } from "../../enum/general";


// we wil be using aws s3 bucket, I will change the url later
const userProfilePictureRootLoc = "https://s3.amazonaws.com/mybucket"


export const userProfileSchema = new Schema<userProfile>({
    fullName:{
        surname: {
            type: String,
            required: true,
            trim:true
        },
        firstName: {
            type:String,
            required:true,
            trim:true
        },
        middleName: {
            type:String,
            trim:true
        }
       
    },
    contactDetails:{
        phoneNumber:{
            type:String,
            trim:true,
            required:true
        },
        email:{
            type:String,
            trim:true,
            unique:true,
            required: true
        }
    },
    address:{
        region:String,
        country:String,
        town:String,
        GPS_Address: String,
        nationalIdentification: new Schema({
            // type of nation identification card eg. voter's id, GH-card etc
            type:String,
            // id value or number
            value:String
        },{_id:false}),
    },
    emergencyInfo:{
        name: String,
        relationship:String,
        phoneNunber:String
    },
    password: {
        type:String,
        required: true,
        trim:true
    },
    picture:{
        type: String,
        // the v value should look something like this /123.png
        get: (v: String) => `${userProfilePictureRootLoc}${v}`
    }
},{_id:false})

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
})


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
    }
})