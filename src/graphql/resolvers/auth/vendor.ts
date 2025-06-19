
import VendorModel from "../../../database/models/auth/vendorModel";


export const vendorResolves = {
    Query:{
        vendors: async (_:any, {offset,limit}:{offset:number, limit:number})=>{

            const [staffs,totalCount] = await Promise.all([
                VendorModel.find({}).sort({createdAt:-1}).skip(offset * limit).limit(limit),
                VendorModel.countDocuments()
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

           const staffs = await VendorModel.findOne({_id:id});
            return staffs
        },
       
    }

}