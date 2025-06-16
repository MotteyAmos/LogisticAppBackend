import mongoose, { Document, Schema } from "mongoose";
import { sevenDaysFromNow } from "../../../rest-api/utils/date-time.ts";
import { Role } from "../../../rest-api/auth/enum/general.ts";


export interface SessionDocument extends Document{
    userId: mongoose.Types.ObjectId;
    userAgent?: String;
    roleId: mongoose.Types.ObjectId;
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
        required:true
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