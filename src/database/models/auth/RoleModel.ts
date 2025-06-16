import mongoose, {Schema} from "mongoose";

import { RoleType } from "../../../rest-api/types/auth/generalTypes.ts";

// const UserPermission = new Schema({
//   type: {
//     type: String,
//     enum: Object.values(Permissions),
//     default: Permissions.DEFAULT,
//   },
// }, { _id: false });

const roleSchema = new Schema<RoleType>({
    name: {
        type: String,
        required:true,
        trim:true,
        unique:true
    },
    permissions:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Permission"
    }]
},{
    timestamps:true
})


const RoleModel = mongoose.model<RoleType>("Role", roleSchema);

export default RoleModel;