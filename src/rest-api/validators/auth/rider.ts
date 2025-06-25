import {z} from "zod";
import { emailSchema, emergencyInfoSchema, financialInfoSchema, nameSchema, passwordSchema, phoneNumberSchema } from "./general";
import { ApproveStatus, Gender } from "../../enum/general";


const riderProfileSchema = z.object({
    fullName: nameSchema,
    gender: z.nativeEnum(Gender),
    dateOfBirth: z.string({required_error:"date of birth required"}),
    password: passwordSchema,
    confirmPassword: passwordSchema,
    nationalIdentification: z.object({
        type:z.string().trim(),
        number: z.string().trim()
    })
}).refine((val)=> val.password === val.confirmPassword,{
    message:"Confirm password and password don't match",
    path:["confirmPassword"]
})


const riderProfessionalDetailSchema= z.object({
    yearsOfDrivingExperience:z.number({message:"Years of driving required"}),
    driverLicenseNumber: z.string({message:"Driver license number required"}).optional()
})

const contactDetailsSchema = z.object({
    phoneNumber: phoneNumberSchema,
    additionalPhoneNumber: phoneNumberSchema.optional(),
    email: emailSchema,
    residentailAddress: z.string().optional(),
    emergencyContactName: z.string().optional(),
    emergencyContactNumber: z.string().optional()
})

const vehicleInfoSchema = z.object({
    vehicleType:z.string(),
    registrationNumber: z.string()
})




export const riderRegistrationSchema = z.object({
    userProfile: riderProfileSchema,
    professionalDetails: riderProfessionalDetailSchema,
    contactDetails: contactDetailsSchema,
    vehicleInfo: vehicleInfoSchema,
    financialDetails: financialInfoSchema,
    
});


export const approvalStatusSchema = z.object({
    id: z.string().trim().length(24,{message:"Invalid id"}),
    status: z.nativeEnum(ApproveStatus)
})