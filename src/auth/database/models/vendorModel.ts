import mongoose, {Schema} from "mongoose";
import { auditingAndConfirmationSchema,financialDetailSchema, preferenceSchema, userProfilePictureRootLoc} from "./generalSchema";
import { accountStatus, Role } from "../../enum/general";
import { compareValue, hashValue } from "../../utils/bcryptEn";
import { vendorType } from "../../types/vendor";
import { userProfile } from "../../types/generalTypes";


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

const vendorSchema = new Schema<vendorType>({
    businessInfo:{
        companyName:String,
        businessType: String,
        businessDescription: String,
        webApplicationDemainName: String
    },
    userProfile: userProfileSchema ,
    financialDetails: financialDetailSchema,
    role: {
        type:String,
        enum: Object.values(Role),
        default:Role.T3PL
    },
    status:{
        type:String,
        enum: Object.values(accountStatus),
        default: accountStatus.INACTIVE
    },
    preference: preferenceSchema,
    auditing:auditingAndConfirmationSchema,
    apiKey:{
        type:String,
        default:""
    }
    

},{
    toJSON: {
        virtuals:true,
        transform(doc,ret){
            delete ret.userProfile.password
            delete ret.preference.twoFactorSecret
            return ret
        },
        getters:true
    },
    toObject:{
        transform(doc,ret){
            delete ret.userProfile.password
            delete ret.preference.twoFactorSecret
            return ret
        },
        virtuals: true,
        getters: true
    },
    collection:"Vendors",
    timestamps:true
})


vendorSchema.virtual("fullName").get(function(){
    return this.userProfile.fullName.surname + " " + this.userProfile.fullName.middleName + " " + this.userProfile.fullName.firstName
})


vendorSchema.pre("save", async function(next){
    // let check whether this works
    if (!this.isModified("userProfile.password")){
        next()
    }
    this.userProfile.password = await hashValue(this.userProfile.password);
    next();
});

vendorSchema.methods.comparePassword = async function (value:string){
    return await compareValue(value, this.password);
}



const VendorModel = mongoose.model<vendorType>("Vendor",vendorSchema);

export default VendorModel;