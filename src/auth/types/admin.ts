import mongoose, { Date } from "mongoose";
import { auditing, financialInfo, preference, userProfile } from "./generalTypes";
import { Role, accountStatus } from "../enum/general";


export interface adminTypes extends mongoose.Document{
        userProfile: userProfile,
        financialDetails: financialInfo,
        role: Role,
        status: accountStatus,
        preference: preference,
        auditing:auditing
    }