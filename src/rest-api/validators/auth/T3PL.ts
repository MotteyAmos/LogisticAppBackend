import { z } from "zod";
import {financialInfoSchema, passwordSchema, phoneNumberSchema } from "../../validators/auth/general.ts";




 const b_infoSchema =  z.string().trim().min(2).max(255)

const businessInfoSchema = z.object({
    companyName:b_infoSchema,
    // businessType: b_infoSchema,
    businessDescription: z.string().trim().optional(),
    businessAddress: z.string().trim().optional(),
    webApplicationDomainName: b_infoSchema.optional(),
    registrationNumber: z.string().trim().optional(),
    gpsAddress: z.string().trim().optional(),
    region: z.string().trim().optional(),
    yearsInOperation: z.string().optional(),
    logo: z.string().optional(),
    streetAddress:z.string().optional()
})

const contactDetailsSchema = z.object({
    name: b_infoSchema,
    email: z.string({required_error:"Business email required"}).email().trim(),
    phoneNumber: phoneNumberSchema,
    additionalPhoneNumber: phoneNumberSchema.optional(),
    position: z.string(),
    ghanaCardNumber: z.string(),
    password: passwordSchema
})


export const T3plRegisterSchema = z.object({
    businessInfo:businessInfoSchema,
    contactDetails: contactDetailsSchema,
    financialDetails: financialInfoSchema,
})