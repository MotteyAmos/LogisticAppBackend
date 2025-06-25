import mongoose, { Schema } from "mongoose";
import {
  auditingAndConfirmationSchema,
  financialDetailSchema,
  preferenceSchema,
  userProfilePictureRootLoc,
} from "./generalSchema";

import { accountStatus, Role } from "../../../rest-api/enum/general";
import { compareValue, hashValue } from "../../../rest-api/utils/auth/bcryptEn";
import {
  vendorType,
  vendorContactDetailsType,
  vendorBusinessInfo,
} from "../../../rest-api/types/auth/vendor";

const contactSchema = new Schema<vendorContactDetailsType>(
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
  },
  { _id: false }
);

const businessInfoSchema = new Schema<vendorBusinessInfo>(
  {
    companyName: {
      type: String,
      requird: true,
      trim: true,
    },
    businessType: {
      type: String,
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
    businessRegistrationNumber: {
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
  },
  { _id: false }
);

const vendorSchema = new Schema<vendorType>(
  {
    businessInfo: businessInfoSchema,
    contactDetails: contactSchema,
    financialDetails: financialDetailSchema,
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.VENDOR,
    },
    status: {
      type: String,
      enum: Object.values(accountStatus),
      default: accountStatus.INACTIVE,
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
    collection: "Vendors",
    timestamps: true,
  }
);

vendorSchema.pre("save", async function (next) {
  // let check whether this works
  if (!this.isModified("contactDetails.password")) {
    next();
  }
  this.contactDetails.password = await hashValue(this.contactDetails.password);
  next();
});

vendorSchema.methods.comparePassword = async function (value: String) {
  return await compareValue(value, this.contactDetails.password);
};

const VendorModel = mongoose.model<vendorType>("Vendor", vendorSchema);

export default VendorModel;
