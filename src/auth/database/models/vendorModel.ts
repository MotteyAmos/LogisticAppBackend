import mongoose, {Schema} from "mongoose";
import { auditingAndConfirmationSchema,financialDetailSchema, preferenceSchema, userProfileSchema } from "./generalSchema";
import { accountStatus, Role } from "../../enum/general";
import { compareValue, hashValue } from "../../utils/bcrypt";
import { vendorType } from "../../types/vendor";


const vendorSchema = new Schema<vendorType>({
    userProfile: userProfileSchema,
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
    auditing:auditingAndConfirmationSchema
    

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
    collection:"Vendor",
    timestamps:true
})


vendorSchema.virtual("fullName").get(function(){
    return this.userProfile.fullName + " " + this.userProfile.fullName.middleName + " " + this.userProfile.fullName.firstName
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