import mongoose, { Schema } from "mongoose";
import {
  auditingAndConfirmationSchema,
  financialDetailSchema,
  preferenceSchema,
} from "./generalSchema";


import { accountStatus, Role } from "../../../rest-api/enum/general";
import { compareValue, hashValue } from "../../../rest-api/utils/auth/bcryptEn";

import { T3PLCompanyInfo, T3PLContactDetailsType, T3PLType } from "../../../rest-api/types/auth/3pl";


const contactSchema = new Schema<T3PLContactDetailsType>(
  {
    phoneNumber: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      required: true,
    },
    name: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    additionalPhoneNumber:{
      type:String,
      trim:true
    },
    position:{
      type:String,
      trim:true
    },
    ghanaCardNumber:{
      type:String,
      trim:true
    },
    
  },
  { _id: false }
);

const businessInfoSchema = new Schema<T3PLCompanyInfo>(
  {
    companyName: {
      type: String,
      requird: true,
      trim: true,
    },

    businessDescription: {
      type: String,
      trim: true,
    },
    webApplicationDomainName: {
      type: String,
      trim: true,
    },
    businessAddress: {
      type: String,
      trim: true,
    },
    registrationNumber: {
      type: String,
      trim: true,
    },
    areaOfOperation: {
      type: String,
      trim: true,
    },
    yearsInOpertion: {
      type: Number,
      default: 0,
    },
    logo: {
      type: String,
      default:""
    },
    businessCertificate:{
      type:String,
      default:""
    },
    gpsAddress:{
      type: String
    },
    region:{
      type:String,
      trim:true
    },
    streetAddress:{
      type:String 
    }
  },
  { _id: false }
);

const T3PLSchema = new Schema<T3PLType>(
  {
    businessInfo: businessInfoSchema,
    contactDetails: contactSchema,
    financialDetails: financialDetailSchema,
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.T3PL,
    },
    status: {
      type: String,
      enum: Object.values(accountStatus),
      default: accountStatus.PENDING,
    },
    preference: preferenceSchema,
    auditing: auditingAndConfirmationSchema,
    apiKey: {
      type: String,
      default: "",
    },
  },
  {
    toJSON: {
      virtuals: true,
      transform(doc, ret) {
        delete ret.contactDetails.password;
        delete ret.preference?.twoFactorSecret;
        return ret;
      },
      getters: true,
    },
    toObject: {
      transform(doc, ret) {
        delete ret.contactDetails.password;
        delete ret.preference?.twoFactorSecret;
        return ret;
      },
      virtuals: true,
      getters: true,
    },
    collection: "T3PLs",
    timestamps: true,
  }
);

T3PLSchema.pre("save", async function (next) {
  // let check whether this works
  if (!this.isModified("contactDetails.password")) {
    next();
  }
  this.contactDetails.password = await hashValue(this.contactDetails.password);
  next();
});

T3PLSchema.methods.comparePassword = async function (value: String) {
  return await compareValue(value, this.contactDetails.password);
};

const T3PLModel = mongoose.model<T3PLType>("T3PL", T3PLSchema);

export default T3PLModel;
