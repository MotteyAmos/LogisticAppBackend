// // 3PL = driver or rider

// import mongoose, {Schema} from "mongoose";
// import { auditingAndConfirmationSchema, contactDetailsSchema, financialDetailSchema, preferenceSchema } from "./generalSchema";
// import { accountStatus, Gender, Role } from "../../enum/general";
// import { compareValue, hashValue } from "../../utils/bcryptEn";
// import { professionalDetails, T3PlPersonalInfo, T3PLTypes } from "../../types/3pl";

// // we wil be using aws s3 bucket, I will change the url later
// const licenceImageRootLoc = "https://s3.amazonaws.com/mybucket"

// const userProfileSchema = new Schema<T3PlPersonalInfo>({
//     fullName:{
//         type:String,
//         required:true,
//         trim:true
//     },
//     gender: {
//         type:String,
//         enum: Object.values(Gender),
//         required:true,
//         default:Gender.MALE
//     },
//     dateOfBirth:{
//         type:Date,
//         required:true
//     },
//     password:{
//         type:String,
//         trim:true
//     },
//     nationalIdentification: new Schema({
//         // type of nation identification card eg. voter's id, GH-card etc
//         type:String,
//         // id value or number
//         number:String,
//         image: {
//             type:String,
//              get:(v:String) => `${licenceImageRootLoc}${v}`
//         }
//     },{_id:false}),
// },{_id:false})

// const T3PLSchema = new Schema<T3PLTypes>({
//     userProfile: userProfileSchema,
//     // contactDetails:contactDetailsSchema,
//     financialDetails: financialDetailSchema,
//     role: {
//         type:String,
//         enum: Object.values(Role),
//         default:Role.T3PL,
//         required:true
//     },
//     status:{
//         type:String,
//         enum: Object.values(accountStatus),
//         default: accountStatus.INACTIVE
//     },
//     preference: preferenceSchema,
//     auditingAndConfirmation:auditingAndConfirmationSchema,
//     professionalDetails: new Schema<professionalDetails>({
//         licenceImage:{
//             type:String,
//             get:(v:String) => `${licenceImageRootLoc}${v}`
//         },
//         yearsOfDrivingExperience:{
//             type:Number,
//             default:0
//         }
//     },{_id:false}),
//     vehicleInfo:{
//         vehicleType:String,
//         registrationNumber:String
        
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
//     collection:"T3PL",
//     timestamps:true
// })




// T3PLSchema.pre("save", async function(next){
//     // let check whether this works
//     if (!this.isModified("userProfile.password")){
//         next()
//     }
//     this.userProfile.password = await hashValue(this.userProfile.password);
//     next();
// });

// T3PLSchema.methods.comparePassword = async function (value:string){
//     return await compareValue(value, this.userProfile.password);
// }



// const T3PLModel = mongoose.model<T3PLTypes>("T3PL", T3PLSchema);

// export default T3PLModel;