import mongoose, { Date } from "mongoose";
import {
  auditingAndConfirmation,
  financialInfo,
  preference,
} from "./generalTypes.ts";
import { Gender, Role, accountStatus } from "../../enum/general.ts";




export interface RiderPersonalInfo {
  fullName: String;
  gender: Gender;
  dateOfBirth: String;
  password: String;
  picture?:String,
  nationalIdentification: {
    type: String;
    number: String;
    image?: String;
  };
}


export interface RiderProfessionalDetails {
  drivingLicenseImg?: String;
  yearsOfDrivingExperience: Number;
  driverLicenseNumber?: String
}

export interface RiderContactDetails {
  phoneNumber: String;
  additionalPhoneNumber?: String;
  email: String;
  residentailAddress?: String;
  emergencyContactName?: String;
  emergencyContactNumber?: String;
}


export interface RiderType extends mongoose.Document {
  userProfile: RiderPersonalInfo;
  professionalDetails: RiderProfessionalDetails;

  contactDetails: RiderContactDetails ;
  vehicleInfo: {
    vehicleType: String;
    registrationNumber: String;
  };
  // branch:
  financialDetails: financialInfo;
  role: Role;
  status: accountStatus;
  preference: preference;
  auditingAndConfirmation: auditingAndConfirmation;

  comparePassword(value: String): Promise<Boolean>;
}




export interface RiderRegistrationDTO {
  userProfile: RiderPersonalInfo;
  financialDetails: financialInfo;
  professionalDetails: {
    yearsOfDrivingExperience: Number;
    driverLicenseNumber?: String;
  };
  contactDetails: RiderContactDetails,
  vehicleInfo: {
    vehicleType: String;
    registrationNumber: String;
  };
}
