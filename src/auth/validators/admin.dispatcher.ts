import {z} from "zod";
import { financialInfoSchema, userProfileSchema } from "./general";


export const adminRegisterSchema = z.object({
    userProfile: userProfileSchema,
    financialDetails: financialInfoSchema,
    role: z.enum(["SUPER_ADMIN","DISPATCHER", "ADMIN"])
})