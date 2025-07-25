import StaffModel from "../../../database/models/auth/staffs.Model";
import { escapeRegex } from "../../../rest-api/utils/general";
import { UserInputError } from "../../utils/catch-error";
import { PipelineStage } from 'mongoose';

export const staffResolves = {
  Query: {
    staffs: async (
      _: any,
      {
        offset,
        limit,
        search,
      }: { offset: number; limit: number; search: string }
    ) => {
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

      const searchRegex = new RegExp(escapeRegex(search.trim()), "i");
      const filterBy:PipelineStage[] = [
        {
          $lookup: {
            from: "roles",
            localField: "role",
            foreignField: "_id",
            as: "role",
          },
        },
        { $unwind: "$role" },
        {
          $match: {
            $expr: {
              $or: [
                // Full name search (handles missing middleName)
                {
                  $regexMatch: {
                    input: {
                      $concat: [
                        "$userProfile.fullName.surname",
                        " ",
                        "$userProfile.fullName.firstName",
                        " ",
                        { $ifNull: ["$userProfile.fullName.middleName", ""] },
                      ],
                    },
                    regex: searchRegex,
                  },
                },
                // Other fields (cast to string if needed)
                {
                  $regexMatch: {
                    input: { $toString: "$userProfile.gender" },
                    regex: searchRegex,
                  },
                },
                {
                  $regexMatch: {
                    input: "$userProfile.contact",
                    regex: searchRegex,
                  },
                },
                {
                  $regexMatch: {
                    input: "$userProfile.email",
                    regex: searchRegex,
                  },
                },
                { $regexMatch: { input: "$role.name", regex: searchRegex } },
              ],
            },
          },
        },
        { $sort: { createdAt: -1 } },
        { $skip: offset },
        { $limit: limit },
      ];

      const _searchBy =
        search.trim().length == 0
          ? await Promise.all([
              StaffModel.find({})
                .populate("role")
                .populate("role.permissions")
                .sort({ createdAt: -1 })
                .skip(offset)
                .limit(limit),
              StaffModel.countDocuments(),
            ])
          : await Promise.all([
              StaffModel.aggregate(filterBy),
              StaffModel.countDocuments(),
            ]);

      const [staffs, totalCount] = _searchBy;

      return {
        data: staffs,
        totalCount,
        hasNextPage: offset + limit < totalCount,
        currentPage: Math.floor(offset / limit) + 1,
      };
    },

    staff: async (_: any, { id }: { id: String }) => {
      const staffs = await StaffModel.findById(id)
        .populate({ path: "role", populate: { path: "permissions" }})
        .exec();
      return staffs;
    },
  },
};
