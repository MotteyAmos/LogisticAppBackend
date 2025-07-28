import { z } from "zod";
import {financialInfoSchema, passwordSchema, phoneNumberSchema } from "../../validators/auth/general.ts";




 const b_infoSchema =  z.string().trim().min(2).max(255)

const businessInfoSchema = z.object({
    companyName:b_infoSchema,
    // businessType: b_infoSchema,
    businessDescription: z.string().trim().optional(),
    webApplicationDomainName: b_infoSchema.optional(),
    businessAddress: b_infoSchema.optional(),
    businessRegistrationNumber: b_infoSchema.optional(),
    areaOfOperation: b_infoSchema.optional(),
    yearsInOpertion: z.number().optional(),
    logo: b_infoSchema.optional() ,
    country_city: z.string().optional()
})

const contactDetailsSchema = z.object({
    name: b_infoSchema,
    email: z.string({required_error:"Business email required"}).email().trim(),
    phoneNumber: phoneNumberSchema,
    password: passwordSchema
})


export const T3plRegisterSchema = z.object({
    businessInfo:businessInfoSchema,
    contactDetails: contactDetailsSchema,
    financialDetails: financialInfoSchema,
})