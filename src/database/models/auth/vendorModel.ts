// import mongoose, {Schema} from "mongoose";
// import { auditingAndConfirmationSchema,financialDetailSchema, preferenceSchema, sessionSchema, userProfilePictureRootLoc} from "./generalSchema";
// import { accountStatus, Role } from "../../enum/general";
// import { compareValue, hashValue } from "../../utils/bcryptEn";
// import { vendorType ,vendorProfileType} from "../../types/vendor";


// const userProfileSchema = new Schema<vendorProfileType>({
//     contactDetails:{
//         phoneNumber:{
//             type:String,
//             trim:true,
//             required:true
//         },
//         email:{
//             type:String,
//             trim:true,
//             unique:true,
//             required: true
//         },
//         name:{
//             type:String,
//             trim:true
//         }
//     },

//     password: {
//         type:String,
//         required: true,
//         trim:true
//     },
//     logo:{
//         type: String,
//         // the v value should look something like this /123.png
//         get: (v: String) => `${userProfilePictureRootLoc}${v}`
//     }
// },{_id:false})



// const vendorSchema = new Schema<vendorType>({
//     businessInfo:{
//         companyName:String,
//         businessType: String,
//         businessDescription: String,
//         webApplicationDemainName: String,
//         businessAddress:String,
//         businessRegistrationNumber:String,
//         countryAndCity: String
//     },
//     userProfile: userProfileSchema ,
//     financialDetails: financialDetailSchema,
//     role: {
//         type:String,
//         enum: Object.values(Role),
//         default:Role.VENDOR
//     },
//     status:{
//         type:String,
//         enum: Object.values(accountStatus),
//         default: accountStatus.INACTIVE
//     },
//     preference: preferenceSchema,
//     auditing:auditingAndConfirmationSchema,
//     apiKey:{
//         type:String,
//         default:""
//     }
    

// },{
//     toJSON: {
//         virtuals:true,
//         transform(doc,ret){
//             delete ret.userProfile.password
//             delete ret.preference?.twoFactorSecret
//             return ret
//         },
//         getters:true
//     },
//     toObject:{
//         transform(doc,ret){
//             delete ret.userProfile.password
//             delete ret.preference?.twoFactorSecret
//             return ret
//         },
//         virtuals: true,
//         getters: true
//     },
//     collection:"Vendors",
//     timestamps:true
// })



// vendorSchema.pre("save", async function(next){
//     // let check whether this works
//     if (!this.isModified("userProfile.password")){
//         next()
//     }
//     this.userProfile.password = await hashValue(this.userProfile.password);
//     next();
// });

// vendorSchema.methods.comparePassword = async function (value:string){
//     return await compareValue(value, this.userProfile.password);
// }



// const VendorModel = mongoose.model<vendorType>("Vendor",vendorSchema);

// export default VendorModel;