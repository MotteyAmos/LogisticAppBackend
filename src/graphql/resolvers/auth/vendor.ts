
import VendorModel from "../../../database/models/auth/vendorModel";
import { accountStatus } from "../../../rest-api/enum/general";
import { UserInputError } from "../../utils/catch-error";

export const vendorResolves = {
    Query:{
        vendors: async (_:any, {offset,limit, status}:{offset:number, limit:number, status:"APPROVED"|"PENDING"| "DENIED"})=>{
 
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

            const [vendors,totalCount] = await Promise.all([
                VendorModel.find({status}).sort({createdAt:-1}).skip(offset).limit(limit),
                VendorModel.countDocuments({status})
            ])

      
            return {
                data:vendors,
                totalCount,
                hasNextPage:offset + limit < totalCount,
                currentPage: Math.floor(offset / limit) +1
            }
        },

        vendor: async (_:any, {id}:{id:String})=>{

           const staffs = await VendorModel.findById(id);
            return staffs
        },
       
    }

}