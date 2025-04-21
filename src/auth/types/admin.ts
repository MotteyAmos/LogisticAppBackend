import mongoose, { Date } from "mongoose";
import { auditingAndConfirmation, financialInfo, preference, SessionType, userProfile } from "./generalTypes";
import { Role, accountStatus } from "../enum/general";
import {z} from "zod"
import { adminRegisterSchema } from "../validators/admin.dispatcher";



export interface adminTypes extends mongoose.Document{
        userProfile: userProfile,
        financialDetails: financialInfo,
        role: Role,
        status: accountStatus,
        preference: preference,
        auditingAndConfirmation:auditingAndConfirmation,
        comparePassword(value:String): Promise<Boolean>
      
    }


export type adminRegisterDto = z.infer<typeof adminRegisterSchema> 