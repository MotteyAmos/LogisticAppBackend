import mongoose from "mongoose";
import {
  address,
  auditingAndConfirmation,
  contactDetails,
  financialInfo,
  preference,
  SessionType,
} from "./generalTypes.ts";
import { accountStatus, Role } from "../../enum/general.ts";

export interface vendorContactDetailsType {
  name: String;
  email: String;
  phoneNumber: String;
  password: String;
}

export interface vendorBusinessInfo {
  companyName: String;
  businessType: String;
  businessDescription?: String;
  webApplicationDomainName?: String;
  businessAddress?: String;
  businessRegistrationNumber?: String;
  areaOfOperation?: String;
  yearsInOpertion?: Number;
  logo?: String;
  country_city?: String
}

export interface vendorType extends mongoose.Document {
  businessInfo: vendorBusinessInfo;
  contactDetails: vendorContactDetailsType;
  financialDetails: financialInfo;
  tempPassword: String;
  role: Role;
  status: accountStatus;
  preference: preference;
  auditing: auditingAndConfirmation;
  apiKey: String;
  comparePassword(value: String): Promise<Boolean>;
}


export interface vendorRegisterDto {
  businessInfo: vendorBusinessInfo;
  contactDetails: vendorContactDetailsType;
  financialDetails: financialInfo;
}
