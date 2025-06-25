
import PermsissionModel from "../../../database/models/auth/PermissionModel"
import RoleModel from "../../../database/models/auth/RoleModel"
export const generalResolves = {
    Query:{
        permissions: async ()=>{
            
            const permission = await PermsissionModel.find({})
            return permission
        },
        roles: async ()=>{
            // only admin should be able to do this, so remeber to update the code

            const roles = await RoleModel.find({}).populate('permissions').exec();
          
            return roles
            
        }
        
    }

    // Role:{
    //     permissions: async ()=>{
    //         const permissions = await 
    //     }
    // }
}