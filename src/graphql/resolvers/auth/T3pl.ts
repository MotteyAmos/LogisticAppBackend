import T3PLModel from "../../../database/models/auth/3PLModel";
import StaffModel from "../../../database/models/auth/staffs.Model";
import { escapeRegex } from "../../../rest-api/utils/general";
import { UserInputError } from "../../utils/catch-error";
import { PipelineStage } from "mongoose";

export const T3plResolves = {
  Query: {
    T3pls:async (
      _: any,
      { offset, limit, status,search }: { offset: number; limit: number;  status:"APPROVED"|"PENDING"| "DENIED"; search:string }
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
      const filterBy: PipelineStage[] = [
        {
            $match: {
              status: status, 
            },
          },
        {
            
          $match: {
            $expr: {
              $or: [
               
                
                {
                  $regexMatch: {
                    input: { $toString: "$businessInfo.companyName" },
                    regex: searchRegex,
                  },
                },
                {
                  $regexMatch: {
                    input: "$contactDetails.email",
                    regex: searchRegex,
                  },
                },
                {
                  $regexMatch: {
                    input: "$contactDetails.phoneNumber",
                    regex: searchRegex,
                  },
                }
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
              T3PLModel.find({status})
                .sort({ createdAt: -1 })
                .skip(offset)
                .limit(limit),
              T3PLModel.countDocuments({status}),
            ])
          : await Promise.all([
              T3PLModel.aggregate(filterBy),
              T3PLModel.countDocuments({status}),
            ]);

      const [T3pls, totalCount] = _searchBy;

      return {
        data:T3pls,
        totalCount,
        hasNextPage: offset + limit < totalCount,
        currentPage: Math.floor(offset / limit) + 1,
      };
    },

    T3pl: async (_: any, { id }: { id: String }) => {
      const T3pl = await T3PLModel.findById(id).lean();
      return T3pl;
    },
  },
};
