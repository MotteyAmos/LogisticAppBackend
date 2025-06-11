import { z } from "zod";
import {
  updatePreferenceSchema,
  updateUserProfileSchema,
  userProfileSchema,
} from "./general.ts";
import mongoose from "mongoose";

const isValidMongooseIdSchema = z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
  message: "Invalid ObjectId",
});

export const staffsRegisterSchema = z.object({
  userProfile: userProfileSchema,
  roleId: z.string({required_error:"role required"}).length(24,{message:"Invalid role id"}),
});

export const updateStaffSchema = z.object({
  staffId: z.string({required_error:"staff id required"}).length(24,{message:"Invalid staff id"}),
  userProfile: updateUserProfileSchema.optional(),
  roleId: z.string({required_error:"role required"}).length(24,{message:"Invalid role id"}).optional(),
  preference: updatePreferenceSchema.optional()
});

export const accountVerifySchema = z.object({
  userId: z.string({ required_error: "userId required" })
});
