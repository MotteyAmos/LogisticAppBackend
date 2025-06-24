// import {z} from "zod";
// import {  financialInfoSchema, nameSchema, passwordSchema, userProfileSchema } from "./general.ts";
// import { Gender } from "../enum/general.ts";


// const T3PlUserProfileSchema = z.object({
//     fullName: nameSchema,
//     gender: z.nativeEnum(Gender),
//     dateOfBirth: z.date(),
//     password:passwordSchema,
//     nationalIdentification
// })


// export const T3PLRegisterSchema = z.object({
//     userProfile: userProfileSchema,
//     financialDetails: financialInfoSchema,
//     professionalDetails:z.object({
//         licenceImage:z.string().trim(),
//         yearsOfDrivingExperience:z.number()
//     }),
//     vehicleInfo: z.object({
//         vehicleType:z.string().trim(),
//         registrationNumber: z.string().trim()
//     })
// })
