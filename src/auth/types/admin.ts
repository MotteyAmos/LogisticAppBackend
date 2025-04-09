import mongoose, { Date } from "mongoose";
import { financialInfo, preference, userProfile } from "./generalTypes";
import { Role } from "../enum/role";


export interface adminTypes extends mongoose.Document{
        userProfile: userProfile,
        financialDetails: financialInfo,
        role: Role,
        status: "active" | "inactive",
        preference: preference,
        auditing:{
            lastLogin: Date
        }
    }