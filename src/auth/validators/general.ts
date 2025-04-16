import {z} from "zod";

export const emailSchema = z.string().trim().email({message:"Invalid email address"}).min(5).max(255);
export const passwordSchema = z.string({required_error:"Password is required"}).trim().min(8,{message:"Minimum password length should be 8"}).max(255);
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
    region: z.string().min(2),
    country:z.string().min(2),
    town: z.string().min(2),
    GPS_Address: z.string().min(2),
    nationalIdentification:z.object({
        type:z.string(),
        value:z.string()
    })
})

export const emergencyInfoSchema = z.object({
    name: nameSchema,
    relationship:z.string({required_error:"relationship field is required"}).trim().min(3),
    phoneNumber: phoneNumberSchema
})

export const userProfileSchema = z.object({
    fullName: fullNameSchma,
    contactDetails: contactDetails,
    address: addressDetailsSchema,
    emergencyInfo: emergencyInfoSchema,
    password: passwordSchema,
    picture: z.string().trim().optional()
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
    message: "At least one of bankAccountDetails or mobileMoneyAccount must be provided",
    path:[]
})


export const loginSchema = z.object({
    email: emailSchema,
    password:passwordSchema,
    role:z.enum(["SUPER_ADMIN","DISPATCHER","ADMIN","3PL","VENDOR"])
})
