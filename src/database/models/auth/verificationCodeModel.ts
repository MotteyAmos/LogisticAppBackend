import mongoose from "mongoose";
import VerificationCodeType from "../../../rest-api/enum/verificationCode";

export interface VerificationCodeDocument extends mongoose.Document {
    userId: mongoose.Types.ObjectId;
    type: VerificationCodeType;
    verificationCodeNumber:String;
    expiresAt: Date;
    createdAt: Date;
}

const VerificationCodeSchema = new mongoose.Schema<VerificationCodeDocument> ({
    userId: {
        type:mongoose.Schema.Types.ObjectId,
          required:true, 
        },
    type: {type: String, required:true},
    verificationCodeNumber:{
        type:String,
        required:true
    },
    createdAt: {type:Date, required:true, default:Date.now},
    expiresAt: {type:Date, required:true}
})

const VerificationCodeModel = mongoose.model<VerificationCodeDocument>(
    "VerificationCode",
    VerificationCodeSchema,
    "verification_codes"
);


export default VerificationCodeModel;