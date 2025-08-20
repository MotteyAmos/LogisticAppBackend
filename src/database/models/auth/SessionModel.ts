import mongoose, { Document, Schema } from "mongoose";
import { sevenDaysFromNow } from "../../../rest-api/utils/date-time.ts";
import { Role } from "../../../rest-api/enum/general.ts";


export interface SessionDocument{
    userId: mongoose.Types.ObjectId;
    userAgent?: String;
    roleId?: mongoose.Types.ObjectId;
    UserType: "STAFF"|"VENDOR"|"T3PL"|"RIDER",
    expiredAt:Date;
    createdAt: Date;
}

const sessionSchema = new Schema<SessionDocument>({
    userId:{
        type: Schema.Types.ObjectId,
        required: true
    },
    userAgent: {
        type: String,
        required: false
    },
    roleId:{
        type: Schema.Types.ObjectId,
       
    },
    UserType: {
         type: String,
         enum:["STAFF","VENDOR","T3PL","RIDER"]
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    expiredAt: {
        type: Date,
        required: true,
        default:  sevenDaysFromNow
    }
});

const SessionModel = mongoose.model<SessionDocument>("session", sessionSchema);

export default SessionModel;