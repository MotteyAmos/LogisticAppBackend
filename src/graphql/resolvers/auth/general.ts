import PermsissionModel from "../../../database/models/auth/PermissionModel";
import RoleModel from "../../../database/models/auth/RoleModel";
import { UserInputError } from "../../utils/catch-error";
export const generalResolves = {
  Query: {
    permissions: async () => {
      const permission = await PermsissionModel.find({});
      return permission;
    },

    roles: async (_: any, { offset, limit }: { offset: number; limit: number }) => {
      // only admin should be able to do this, so remeber to update the code
          
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

      const [roles, totalCount] = await Promise.all([
        RoleModel.find({})
          .sort({ createdAt: -1 })
          .populate("permissions")
          .skip(offset)
          .limit(limit)
          .exec(),
        RoleModel.countDocuments(),
      ]);



      return {
        data: roles,
        totalCount,
        hasNextPage: offset + limit < totalCount,
        currentPage: Math.floor(offset / limit) + 1,
      };
    },
  },

  // Role:{
  //     permissions: async ()=>{
  //         const permissions = await
  //     }
  // }
};
