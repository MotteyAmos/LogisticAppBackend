import mongoose, { Date } from "mongoose";
import { auditingAndConfirmation, financialInfo, preference, RoleType, SessionType,  updatePreference, updateUserProfile, userProfile } from "./generalTypes.ts";
import { Role, accountStatus } from "../../enum/general.ts";
import {z} from "zod"
import { accountVerifySchema, staffsRegisterSchema } from "../../validators/auth/staffs.ts";



export interface IStaff extends mongoose.Document{
        userProfile: userProfile,
        role: RoleType| mongoose.Types.ObjectId,
        // status: accountStatus,
        preference: preference,
        auditingAndConfirmation:auditingAndConfirmation,
        comparePassword(value:String): Promise<Boolean>
      
    }


export type staffRegisterDto = z.infer<typeof staffsRegisterSchema> 

export interface updateStaffAccountDTO {
    staffId: String,
    userProfile?: updateUserProfile,
    roleId?: String,
    preference?:updatePreference
}

export type accountVerifyDTO = z.infer<typeof accountVerifySchema>