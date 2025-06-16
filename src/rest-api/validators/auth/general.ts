import {z} from "zod";
import { Gender, Permissions, Role } from "../../enum/general.ts";
import mongoose from "mongoose";


export const emailSchema = z.string().trim().email({message:"Invalid email address"}).min(5).max(255);
export const passwordSchema = z.string({required_error:"Password is required"}).trim().min(8,{message:"Minimum password length should be 8 characters"}).max(255);
export const nameSchema =  z.string().trim().min(2).max(255)
export const phoneNumberSchema = z.string({required_error:"phone number required"}).min(10,{message:"phone number length is incorrect"}).max(20);


export const fullNameSchma= z.object(
    {
        surname: nameSchema,
        firstName: nameSchema,
        middleName: nameSchema.optional()
    }
)



export const contactDetails = z.object({
    phoneNumber: phoneNumberSchema,
    email: emailSchema
})

export const addressDetailsSchema = z.object({
    region: z.string().min(2).optional(),
    country:z.string().min(2).optional(),
    town: z.string().min(2).optional(),
    GPS_Address: z.string().min(2).optional(),
    nationalIdentification:z.object({
        type:z.string(),
        value:z.string()
    }).optional()
})

export const emergencyInfoSchema = z.object({
    name: nameSchema,
    relationship:z.string({required_error:"relationship field is required"}).trim().min(3),
    phoneNumber: phoneNumberSchema
}).optional()

export const userProfileSchema = z.object({
    fullName: fullNameSchma,
    gender: z.enum([Gender.FEMALE,Gender.MALE]),
    email: emailSchema,
    contact: phoneNumberSchema,
    password: passwordSchema,
    picture: z.string().trim().optional()
})

export const updateFullNameSchma= z.object(
    {
        surname: nameSchema.optional(),
        firstName: nameSchema.optional(),
        middleName: nameSchema.optional()
    }
)

export const updateUserProfileSchema = z.object({
    fullName: updateFullNameSchma.optional(),
    gender: z.enum([Gender.FEMALE,Gender.MALE]).optional(),
    email: emailSchema.optional(),
    contact: phoneNumberSchema.optional(),
    password: passwordSchema.optional(),
    picture: z.string().trim().optional()
})

export const updatePreferenceSchema = z.object({
     enable2FA:z.boolean().optional(),
    enableEmailNotification: z.boolean().optional()
})



export const financialInfoSchema = z.object({
    bankAccountDetails:z.object({
        bankName: z.string({required_error: "Name of bank required"}).trim(),
        accountNumber: z.string({required_error:"Account Number required"}).trim(),
        recipientName: nameSchema
    }).optional(),
    mobileMoneyAccount: z.object({
        phoneNumber:phoneNumberSchema,
        recipientName: nameSchema
    }).optional()
}).refine((val)=> val.bankAccountDetails || val.mobileMoneyAccount, {
    message: "Provide at least bankAccount or mobileMoney details ",
    path:[]
})

const isValidMongooseIdSchema = z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
  message: "Invalid ObjectId",
});

export const roleSchema = z.object({
  name: z.string().min(1, "Name is required").trim(),
  permissions: z.array(isValidMongooseIdSchema).optional().default([]),
});

export const permissionSchema = z.object({
    name: z.string().min(1,"Name is required").trim(),
    description: z.string().min(1,"Description is required").trim()
})

export const updatePermissionSchema = z.object({
    id: z.string(isValidMongooseIdSchema).length(24,{message:"Invalid permission id"}).trim(),
    name: z.string().trim().optional(),
    description: z.string().optional() 
}).refine((val)=> val.name || val.description, {
    message: "Provide at least name or description for update",
    path:[]
})


export const updateRoleSchema = z.object({
    id: z.string({required_error:"Id of the role required"}).length(24, {message:"Invalid id"}).trim(),
    name: z.string().trim().optional(),
    permissions: z.array(isValidMongooseIdSchema).optional() 
}).refine((val)=> val.name || val.permissions, {
    message: "Provide at least name or permission for update",
    path:[]
})

export const roleId = z.string({required_error:"role id required"}).length(24,{message:"Invalid id"}).trim()
export const PermissionId = z.string({required_error:"role id required"}).length(24, {message:"Invalid id"}).trim()
export const staffId = z.string({required_error:"staff id required"}).length(24, {message:"Invalid id"}).trim()



export const loginSchema = z.object({
    email: emailSchema,
    password:passwordSchema,
    role:z.enum(["STAFF","VENDOR","T3PL"]),
    userAgent:z.string().trim().optional()
})


export const forgotPasswordSchema = z.object({
    email: emailSchema,
    role:z.enum(["STAFF","VENDOR","T3PL"])
})

export const OTPSchema = z.object({
    email: emailSchema,
    role:z.enum(["STAFF","VENDOR","T3PL"]),
    otpCode: z.string({required_error:"OTP code required"}).trim(),
    password:passwordSchema,
    confirmPassword: passwordSchema,
    userAgent:z.string().optional()
}).refine((val)=> val.password === val.confirmPassword,{
    message:"Confirm password and password do not match",
    path: ["confirmPassword"]
})


