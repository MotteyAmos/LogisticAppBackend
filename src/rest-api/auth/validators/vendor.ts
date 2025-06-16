import { z } from "zod";
import {financialInfoSchema, passwordSchema, phoneNumberSchema } from "./general.ts";




export const b_infoSchema =  z.string().trim().min(2).max(255)

const businessInfoSchema = z.object({
    companyName:b_infoSchema,
    businessType: b_infoSchema,
    businessDescription: z.string().trim().optional(),
    webApplicationDomainName: b_infoSchema.optional(),
    businessAddress: b_infoSchema.optional(),
    businessRegistrationNumber: b_infoSchema.optional(),
    areaOfOperation: b_infoSchema.optional(),
    yearsInOpertion: z.number({required_error:"Years in operation required"}),
    logo: b_infoSchema.optional() 
})

const contactDetailsSchema = z.object({
    name: b_infoSchema,
    email: z.string({required_error:"Business email required"}).email().trim(),
    phoneNumber: phoneNumberSchema,
    password: passwordSchema
})


export const vendorRegisterSchema = z.object({
    businessInfo:businessInfoSchema,
    contactDetails: contactDetailsSchema,
    financialDetails: financialInfoSchema,
})