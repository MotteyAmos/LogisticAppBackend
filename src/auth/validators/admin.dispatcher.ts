import {z} from "zod";
import { financialInfoSchema, userProfileSchema } from "./general";
import { Role } from "../enum/general";



export const adminRegisterSchema = z.object({
    userPrfile: userProfileSchema,
    financialDetails: financialInfoSchema,
    role: z.enum(["SUPER_ADMIN","DISPATCHER", "ADMIN"])
})