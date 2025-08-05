import OrderModel from "../../../database/models/orders/orderModule";
import { escapeRegex } from "../../../rest-api/utils/general";
import { UserInputError } from "../../utils/catch-error";
import { PipelineStage } from "mongoose";
export const orderResolvers = {
  Query: {
    orders: async (
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

      const filterBy: PipelineStage[] = [
        {
          $match: {
            $expr: {
              $or: [
                // Full name search (handles missing middleName)
                {
                  $regexMatch: {
                    input: "$destination",
                    regex: searchRegex,
                  },
                },

                {
                  $regexMatch: {
                    input: "$productDescription",
                    regex: searchRegex,
                  },
                },
                {
                  $regexMatch: {
                    input: "$recipientName",
                    regex: searchRegex,
                  },
                },
                { $regexMatch: { input: "$orderId", regex: searchRegex } },
                {
                  $regexMatch: {
                    input: "$recipientNumber",
                    regex: searchRegex,
                  },
                },
                 {
                  $regexMatch: {
                    input: "$status",
                    regex: searchRegex,
                  },
                },
              ],
            },
          },
        },
        { $sort: { createdAt: -1 } },
        { $skip: offset },
        { $limit: limit },
      ];

      const [orders, totalCount] =
        search.trim().length == 0
          ? await Promise.all([
              OrderModel.find({})
                .sort({ createdAt: -1 })
                .skip(offset)
                .limit(limit),
              OrderModel.countDocuments(),
            ])
          : await Promise.all([
              OrderModel.aggregate(filterBy),
              OrderModel.countDocuments(),
            ]);

      return {
        data: orders,
        totalCount,
        hasNextPage: offset + limit < totalCount,
        currentPage: Math.floor(offset / limit) + 1,
      };
    },

    order: async (_: any, { id }: { id: String }) => {
      const order = await OrderModel.findOne({ _id: id });
      return order;
    },
  },
};
