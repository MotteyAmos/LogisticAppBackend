
import StaffModel from "../../../database/models/auth/staffs.Model"


export const staffResolves = {
    Query:{
        staffs: async (_:any, {offset,limit}:{offset:number, limit:number})=>{

            const [staffs, totalCount] = await Promise.all([
                StaffModel.find({}).populate("role").populate("role.permissions").sort({createdAt:-1}).skip(offset*limit).limit(limit),
                StaffModel.countDocuments()
            ])

            const calOffset = offset ==0 ? 1 :offset
           
            return  {
                data:staffs,
                totalCount,
                hasNextPage:calOffset  < totalCount,
                currentPage: Math.floor((offset*limit)/limit) +1
            }
        },

        staff: async (_:any, {id}:{id:String})=>{

           const staffs = await StaffModel.findById(id).populate({path: "role",populate: {path: "permissions"}}).exec();
            return staffs
        },
       
    }

}