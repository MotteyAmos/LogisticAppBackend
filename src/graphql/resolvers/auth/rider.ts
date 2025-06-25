import RiderModel from "../../../database/models/auth/RiderModel";
import { accountStatus } from "../../../rest-api/enum/general";


export const riderResolvers = {

    Query:{
        riders: async(_:any, {offset,limit, status}:{offset:number, limit:number, status:"APPROVED"|"PENDING"})=>{

            let tempStatus;
            if (status == "APPROVED"){
                tempStatus = accountStatus.ACTIVE
            }else if(status == 'PENDING'){
                tempStatus = accountStatus.INACTIVE
            }

            const [riders,totalCount] = await 
                    Promise.all([RiderModel.find({status:tempStatus}).sort({createdAt:-1}).skip(offset * limit).limit(limit),
                    RiderModel.countDocuments({status:tempStatus})
                        ])
                        
            const calOffset = offset ==0 ? 1 :offset
            
            return {
                data:riders,
                totalCount,
                hasNextPage:calOffset < totalCount,
                currentPage: Math.floor((offset * limit)/limit) +1
            }
        },

         rider: async (_:any, {id}:{id:String})=>{

           const rider = await RiderModel.findById(id);
            return rider
        },
    }
}