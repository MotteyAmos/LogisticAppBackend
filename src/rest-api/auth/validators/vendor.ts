import { z } from "zod";
import {  addressDetailsSchema, contactDetails, emergencyInfoSchema, financialInfoSchema, passwordSchema } from "./general.ts";


export const vendorProfileSchema = z.object({
    contactDetails: contactDetails,
    address: addressDetailsSchema.omit({nationalIdentification:true}).optional() ,
    password: passwordSchema,
    logo: z.string().trim().optional()
})

export const b_infoSchema =  z.string().trim().min(2).max(255)

const businessInfoSchema = z.object({
    companyName:b_infoSchema,
    businessType: b_infoSchema,
    businessDescription: z.string().trim().min(2).max(500).optional(),
    webApplicationDomainName: b_infoSchema
})



export const vendorRegisterSchema = z.object({
    userProfile: vendorProfileSchema,
    financialDetails: financialInfoSchema,
    businessInfo:businessInfoSchema,
   
})