import mongoose, {Schema} from "mongoose";
import { PermsissionType} from "../../../rest-api/auth/types/generalTypes.ts";



const permissionSchema = new Schema<PermsissionType>({
    name: {
        type: String,
        required:true,
        trim:true,
        unique:true
    },
    description:String
},{
    timestamps:true
})


const PermsissionModel = mongoose.model<PermsissionType>("Permission", permissionSchema);

export default PermsissionModel;