import PermsissionModel from "../../../database/models/auth/PermissionModel";
import RoleModel from "../../../database/models/auth/RoleModel";
import { escapeRegex } from "../../../rest-api/utils/general";
import { UserInputError } from "../../utils/catch-error";
export const generalResolves = {
  Query: {
    permissions: async () => {
      const permission = await PermsissionModel.find({});
      return permission;
    },

    roles: async (
      _: any,
      {
        offset,
        limit,
        search,
      }: { offset: number; limit: number; search: string }
    ) => {
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

      const _searchBy =
        search.trim().length == 0
          ? await Promise.all([
              RoleModel.find({})
                .sort({ createdAt: -1 })
                .populate("assignTo")
                .populate("permissions")
                .skip(offset)
                .limit(limit)
                .exec(),
              RoleModel.countDocuments(),
            ])
          : await Promise.all([
              RoleModel.find({
                name: { $regex: new RegExp(escapeRegex(search.trim()), "i") },
              })
                .populate("assignTo")
                .populate("permissions")
                .skip(offset)
                .limit(limit)
                .exec(),
              RoleModel.countDocuments(),
            ]);

      const [roles, totalCount] = _searchBy;

      

      return {
        data: roles,
        totalCount,
        hasNextPage: offset + limit < totalCount,
        currentPage: Math.floor(offset / limit) + 1,
      };
    },

    role: async (_: any, { roleId }: { roleId: string }) => {
      if (!roleId) {
        throw new UserInputError("Please provide a role id", {
          argumentName: "roleId",
        });
      }

      const role = await RoleModel.findById(roleId).populate("assignTo").populate("permissions").exec()

      return role
    },
  },

  // Role:{
  //     permissions: async ()=>{
  //         const permissions = await
  //     }
  // }
};
