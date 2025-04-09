import mongoose, {Schema} from "mongoose";
import { adminTypes } from "../../types/admin";


const adminSchema = new Schema<adminTypes>({
    userProfile:{
        fullName:{
            surname: {
                type: String,
                required: true,
            },
            firstName: {
                type:String,
                required:true
            },
            middleName: String,
            password: {
                type:String,
                required: true,
                trim:true
            }
        }
    },

},{
    toJSON: {
        virtuals:true,
        transform(doc,ret){
            delete ret.userProfile.password
            return ret
        }
    },
    toObject:{
        transform(doc,ret){
            delete ret.userProfile.password
            return ret
        }
    },
    collection:"Admins",
    timestamps:true
})


adminSchema.virtual("fullName").get(function(){
    return this.userProfile.fullName + " " + this.userProfile.fullName.middleName + " " + this.userProfile.fullName.firstName
})
