import mongoose, { Document, Schema } from "mongoose";
import { sevenDaysFromNow } from "../../../utils/date-time";
import { Role } from "../../enum/general";


export interface SessionDocument extends Document{
    userId: mongoose.Types.ObjectId;
    userAgent?: string;
    userRole:Role;
    expiredAt:Date;
    createdAt: Date;
}

const sessionSchema = new Schema<SessionDocument>({
    userId:{
        type: Schema.Types.ObjectId,
        required: true
    },
    userRole: {
            type:String,
            enum: Object.values(Role),
            default:Role.T3PL
        },
    userAgent: {
        type: String,
        required: false
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