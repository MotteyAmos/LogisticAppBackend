import mongoose, { Schema } from "mongoose";
import { IStaff } from "../../../rest-api/auth/types/staffs.ts";
import {
  auditingAndConfirmationSchema,
  preferenceSchema,
} from "./generalSchema.ts";
import { compareValue, hashValue } from "../../../rest-api/auth/utils/bcryptEn.ts";
import { userProfile } from "../../../rest-api/auth/types/generalTypes.ts";
import { Gender } from "../../../rest-api/auth/enum/general.ts";

const userProfileSchema = new Schema<userProfile>({
  fullName: {
    surname: {
      type: String,
      required: true,
      trim: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    middleName: {
      type: String,
      trim: true,
    },
  },
  gender:{
    type: String,
    enum: Object.values(Gender)
  },
  contact: {
    type: String,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    trim: true,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  picture: {
    type: String,
    // the v value should look something like this /123.png
    // get: (v: String) => `${userProfilePictureRootLoc}${v}`,
  },
});

const staffSchema = new Schema<IStaff>(
  {
    userProfile: userProfileSchema,

    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
    },
    // status:{
    //     type:String,
    //     enum: Object.values(accountStatus),
    //     default: accountStatus.INACTIVE
    // },
    preference: {
      type:preferenceSchema,
      default: ()=>({})
    },
    auditingAndConfirmation: {
      type: auditingAndConfirmationSchema,
      default: ()=>({})
    }
  },

  {
    toJSON: {
      virtuals: true,
      transform(doc, ret) {
        delete ret.userProfile.password;
        delete ret.preference?.twoFactorSecret;

        return ret;
      },
      getters: true,
    },
    toObject: {
      transform(doc, ret) {
        delete ret.userProfile.password;
        delete ret.preference?.twoFactorSecret;
    
        return ret;
      },
      virtuals: true,
      getters: true,
    },
    collection: "Staffs",
    timestamps: true,
  }
);

staffSchema.virtual("fullName").get(function () {
  return (
    this.userProfile.fullName.surname +
    " " +
    this.userProfile.fullName.middleName +
    " " +
    this.userProfile.fullName.firstName
  );
});

staffSchema.pre("save", async function (next) {
  // let check whether this works
  if (!this.isModified("userProfile.password")) {
    next();
  }
  this.userProfile.password = await hashValue(this.userProfile.password);
  next();
});

staffSchema.methods.comparePassword = async function (value: string) {
  return await compareValue(value, this.userProfile.password);
};

const StaffModel = mongoose.model<IStaff>("Staff", staffSchema);

export default StaffModel;
