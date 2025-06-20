// import mongoose, { Date } from "mongoose";
// import {
//   auditingAndConfirmation,
//   financialInfo,
//   preference,
// } from "./generalTypes.ts";
// import { Gender, Role, accountStatus } from "../enum/general.ts";

// export interface professionalDetails {
//   drivingLicenseImg?: String;
//   yearsOfDrivingExperience: Number;
// }

// export interface T3PlContactDetails {
//   phoneNumber: String;
//   additionalPhoneNumber?: String;
//   email: String;
//   residentailAddress: String;
//   emergencyContactName: String;
//   emergencyContactNumber: String;
// }

// export interface T3PlPersonalInfo {
//   fullName: String;
//   gender: Gender;
//   dateOfBirth: Date;
//   password: String;
//   nationalIdentification: {
//     type: String;
//     number: String;
//     image: String;
//   };
// }

// export interface T3PLTypes extends mongoose.Document {
//   userProfile: T3PlPersonalInfo;
//   contactDetails: T3PlContactDetails ;
//   vehicleInfo: {
//     vehicleType: String;
//     registrationNumber: String;
//   };
//   // branch:
//   financialDetails: financialInfo;
//   role: Role;
//   status: accountStatus;
//   preference: preference;
//   auditingAndConfirmation: auditingAndConfirmation;
//   professionalDetails: professionalDetails;

//   comparePassword(value: String): Promise<Boolean>;
// }

// export interface T3PLRegistrationDTO {
//   userProfile: T3PlPersonalInfo;
//   financialDetails: financialInfo;
//   professionalDetails: {
//     licenceImage: String;
//     yearsOfDrivingExperience: Number;
//     driverLicenseNumber: String;
//   };
//   vehicleInfo: {
//     vehicleType: String;
//     registrationNumber: String;
//   };
// }
