import mongoose from "mongoose";
import { auditingAndConfirmation, financialInfo, preference } from "./generalTypes";
import { accountStatus, Role } from "../../enum/general";



export interface T3PLCompanyInfo {
  companyName: String;
  businessDescription?: String;
  webApplicationDomainName?: String;
  businessAddress?: String;
  businessRegistrationNumber?: String;
  areaOfOperation?: String;
  yearsInOpertion?: Number;
  logo?: String;
  country_city?: String
}

export interface T3PLContactDetailsType {
  name: String;
  email: String;
  phoneNumber: String;
  password: String;
}


export interface T3PLType extends mongoose.Document {
  businessInfo: T3PLCompanyInfo;
  contactDetails: T3PLContactDetailsType;
  financialDetails: financialInfo;
  role: Role;
  status: accountStatus;
  preference: preference;
  auditing: auditingAndConfirmation;
  apiKey: String;
  comparePassword(value: String): Promise<Boolean>;
}


export interface T3PLRegisterDto {
  businessInfo: T3PLCompanyInfo;
  contactDetails: T3PLContactDetailsType;
  financialDetails: financialInfo;
}
