import {z} from "zod";
import {  financialInfoSchema, userProfileSchema } from "./general";



export const T3PLRegisterSchema = z.object({
    userProfile: userProfileSchema,
    financialDetails: financialInfoSchema,
    professionalDetails:z.object({
        licenceImage:z.string().trim(),
        yearsOfDrivingExperience:z.number()
    }),
    vehicleInfo: z.object({
        vehicleType:z.string().trim(),
        registrationNumber: z.string().trim()
    })
})
