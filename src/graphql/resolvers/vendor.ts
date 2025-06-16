

import VendorModel from "../../database/models/auth/vendorModel"


export const vendorResolves = {
    Query:{
        vendors: async ()=>{

            const staffs = await VendorModel.find({})
            return staffs
        },

        vendor: async (_:any, {id}:{id:String})=>{

           const staffs = await VendorModel.findOne({_id:id});
            return staffs
        },
       
    }

}