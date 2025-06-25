
import VendorModel from "../../../database/models/auth/vendorModel";
import { accountStatus } from "../../../rest-api/enum/general";


export const vendorResolves = {
    Query:{
        vendors: async (_:any, {offset,limit, status}:{offset:number, limit:number, status:"APPROVED"|"PENDING"})=>{
 
        
            let tempStatus;
            if (status == "APPROVED"){
                tempStatus = accountStatus.ACTIVE
            }else if(status == 'PENDING'){
                tempStatus = accountStatus.INACTIVE
            }

            const [staffs,totalCount] = await Promise.all([
                VendorModel.find({status:tempStatus}).sort({createdAt:-1}).skip(offset * limit).limit(limit),
                VendorModel.countDocuments({status:tempStatus})
            ])

          
            const calOffset = offset ==0 ? 1 :offset
            return {
                data:staffs,
                totalCount,
                hasNextPage:calOffset < totalCount,
                currentPage: Math.floor((offset * limit)/limit) +1
            }
        },

        vendor: async (_:any, {id}:{id:String})=>{

           const staffs = await VendorModel.findById(id);
            return staffs
        },
       
    }

}