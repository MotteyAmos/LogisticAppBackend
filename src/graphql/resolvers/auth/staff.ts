
import StaffModel from "../../../database/models/auth/staffs.Model"
import { UserInputError } from "../../utils/catch-error";


export const staffResolves = {
    Query:{
        staffs: async (_:any, {offset,limit}:{offset:number, limit:number})=>{

            if (offset < 0) {
            throw new UserInputError("Offset cannot be negative", {
                argumentName: "offset",
            });
            }
    
            if (limit <= 0 || limit > 100) {
            throw new UserInputError("Limit must be between 1 and 100", {
                argumentName: "limit",
                limitValue: limit,
            });
            }
                  
            const [staffs, totalCount] = await Promise.all([
                StaffModel.find({}).populate("role").populate("role.permissions").sort({createdAt:-1}).skip(offset).limit(limit),
                StaffModel.countDocuments()
            ])

           
            return  {
                data:staffs,
                totalCount,
                hasNextPage:offset + limit < totalCount,
                currentPage: Math.floor(offset/limit) +1
           }
        },

        staff: async (_:any, {id}:{id:String})=>{

           const staffs = await StaffModel.findById(id).populate({path: "role",populate: {path: "permissions"}}).exec();
            return staffs
        },
       
    }

}