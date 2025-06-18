
import StaffModel from "../../../database/models/auth/staffs.Model"


export const staffResolves = {
    Query:{
        staffs: async ()=>{

            const staffs = await StaffModel.find({}).populate("role").populate("role.permissions")
            return staffs
        },

        staff: async (_:any, {id}:{id:String})=>{

           const staffs = await StaffModel.findOne({_id:id}).populate({path: "role",populate: {path: "permissions"}}).exec();
            return staffs
        },
       
    }

}