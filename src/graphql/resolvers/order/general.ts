import OrderModel from "../../../database/models/orders/orderModule";
import { T3PLType } from "../../../rest-api/types/auth/3pl";
import { RiderType } from "../../../rest-api/types/auth/rider";
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
      // Input validation (unchanged)
      if (offset < 0) throw new UserInputError("Offset cannot be negative");
      if (limit <= 0 || limit > 100)
        throw new UserInputError("Limit must be 1-100");

      const searchRegex = new RegExp(escapeRegex(search.trim()), "i");

      // Base pipeline stages
      const basePipeline: PipelineStage[] = [
        {
          $lookup: {
            from: "Riders", // <- lowercased collection name
            localField: "assignedTo",
            foreignField: "_id",
            as: "riderDetails",
          },
        },
        // Lookup T3PLs
        {
          $lookup: {
            from: "T3PLS", // <- lowercase (unless you manually set your collection name)
            localField: "assignedTo",
            foreignField: "_id",
            as: "t3plDetails",
          },
        },
        // Determine which one to use based on model type
        {
          $addFields: {
            assignedTo: {
              $cond: [
                { $eq: ["$assignToModelName", "Rider"] },
                { $arrayElemAt: ["$riderDetails", 0] },
                {
                  $cond: [
                    { $eq: ["$assignToModelName", "T3PL"] },
                    { $arrayElemAt: ["$t3plDetails", 0] },
                    null,
                  ],
                },
              ],
            },
          },
        },
        // Clean up the extra lookup results
        { $project: { riderDetails: 0, t3plDetails: 0 } },
        { $sort: { createdAt: -1 } },
        { $skip: offset },
        { $limit: limit },
      ];

      // Add search filter if needed
      const fullPipeline =
        search.trim().length === 0
          ? basePipeline
          : [
              {
                $match: {
                  $expr: {
                    $or: [
                      {
                        $regexMatch: {
                          input: "$destination",
                          regex: searchRegex,
                        },
                      },
                      // ... other search fields ...
                    ],
                  },
                },
              },
              ...basePipeline,
            ];

      // Execute query
      const [orders, totalCount] = await Promise.all([
        OrderModel.aggregate(fullPipeline),
        search.trim().length === 0
          ? OrderModel.countDocuments()
          : OrderModel.aggregate([
              ...fullPipeline.slice(0, 1),
              { $count: "totalCount" },
            ]).then((res) => res[0]?.totalCount || 0),
      ]);

      return {
        data: orders,
        totalCount,
        hasNextPage: offset + limit < totalCount,
        currentPage: Math.floor(offset / limit) + 1,
      };
    },

    order: async (_: any, { id }: { id: String }) => {
      console.log("it's working")
      const order = await OrderModel.findById(id).populate("assignedTo");
      
      return order;
    },
  },

  AssignedTo: {
  __resolveType(obj: any) {
    if (!obj) return null;
    if (obj.vehicleType || obj.userProfile) return "Rider";
    if (obj.businessInfo || obj.t3plId) return "T3PL";
    return null;
  },
},
};
