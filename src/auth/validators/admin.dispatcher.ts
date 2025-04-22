import {z} from "zod";
import { emergencyInfoSchema, financialInfoSchema, userProfileSchema } from "./general";


export const adminRegisterSchema = z.object({
    userProfile: userProfileSchema,
    financialDetails: financialInfoSchema,
    role: z.enum(["SUPER_ADMIN","DISPATCHER", "ADMIN"])
})

export const accountVerifySchema = z.object({
    userId:z.string({required_error:"userId required"})
})
