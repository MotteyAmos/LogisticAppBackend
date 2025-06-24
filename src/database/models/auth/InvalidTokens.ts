import mongoose, { Document, Schema } from "mongoose";


export interface InvalidTokenDocument extends Document{
    invalidToken: String
}

const invalidTokenSchema = new Schema<InvalidTokenDocument>({
    invalidToken:{
        type:String,
        trim:true
    }
});

const InvalidTokenModel = mongoose.model<InvalidTokenDocument>("InvalidToken", invalidTokenSchema);

export default InvalidTokenModel;