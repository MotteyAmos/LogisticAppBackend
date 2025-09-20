import { ObjectId } from "mongodb";
import { GraphContext } from "../../..";
import OrderCounterModel from "../../../database/models/orders/OrderCounter";
import OrderModel from "../../../database/models/orders/orderModule";
import { orderStatus } from "../../../rest-api/enum/orders";
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
        pickupDateFrom,
        pickupDateTo,
        entityFilter,
        orderIds,
      }: {
        offset: number;
        limit: number;
        search: string;
        entityFilter: string;
        orderIds: string[];
        pickupDateFrom: string;
        pickupDateTo: string;
      },
      { payload }: GraphContext
    ) => {
 
      let orderIdInitail = "SELF";
      if (payload?.UserType == "VENDOR") {
        const orderCounter = await OrderCounterModel.findOne({
          vendorId: payload?.userId,
        });

        if (orderCounter?.initials) {
          orderIdInitail = orderCounter.initials;
        }
      }

      if (offset < 0) throw new UserInputError("Offset cannot be negative");
      if (limit <= 0 || limit > 100)
        throw new UserInputError("Limit must be 1-100");

      const searchRegex = new RegExp(escapeRegex(search.trim()), "i");
      const entityFilterRegex = new RegExp(
        escapeRegex(entityFilter.trim()),
        "i"
      );

      const matchStages: PipelineStage[] = [];

      if (payload?.UserType === "T3PL" || payload?.UserType === "RIDER") {
        matchStages.push({
          $match: {
            assignedTo: new ObjectId(payload?.userId),
          },
        });
      }

      // filter by date
     
      if (pickupDateFrom && pickupDateTo) {
        matchStages.push({
          $match: {
            orderDate: {
              $gte: new Date(pickupDateFrom),
              $lte: new Date(pickupDateTo),
            },
          },
        });
      } else if (pickupDateFrom) {
        matchStages.push({
          $match: {
            orderDate: {
              $gte: new Date(pickupDateFrom),
          
            },
          },
        });
      } else if (pickupDateTo) {
       matchStages.push({
          $match: {
            orderDate: {
            
              $lte: new Date(pickupDateTo),
            },
          },
        });
      }

      if (orderIds.length > 0) {
        matchStages.push({
          $match: {
            orderId: {
              $in: orderIds,
              // $regex: `^${orderIdInitail}`,
              $options: "i",
            },
          },
        });
      }

      if (search.trim()) {
        matchStages.push({
          $match: {
            $expr: {
              $or: [
                { $regexMatch: { input: "$status", regex: searchRegex } },
                // { $regexMatch: { input: "$destination", regex: searchRegex } },
                // ... other search fields
              ],
            },
          },
        });
      }

      // Base pipeline stages
      const basePipeline: PipelineStage[] = [
        {
          $lookup: {
            from: "Riders",
            localField: "assignedTo",
            foreignField: "_id",
            as: "riderDetails",
          },
        },

        {
          $lookup: {
            from: "T3PLS",
            localField: "assignedTo",
            foreignField: "_id",
            as: "t3plDetails",
          },
        },

        {
          $lookup: {
            from: "Vendors",
            localField: "source.vendorID",
            foreignField: "_id",
            as: "vendorDetails",
          },
        },

        {
          $addFields: {
            assignedTo: {
              $cond: [
                { $eq: ["$assignToModelName", "T3PL"] },
                { $arrayElemAt: ["$t3plDetails", 0] },

                {
                  $cond: [
                    { $eq: ["$assignToModelName", "Rider"] },
                    { $arrayElemAt: ["$riderDetails", 0] },
                    null,
                  ],
                },
              ],
            },
            source: {
              $cond: [
                { $eq: ["$source.type", "VENDOR"] },
                { $arrayElemAt: ["$vendorDetails", 0] },
                null,
              ],
            },
          },
        },

        {
          $project: {
            riderDetails: 0,
            t3plDetails: 0,
          },
        },
      ];

      if (entityFilter.trim()) {
        basePipeline.push({
          $match: {
            $expr: {
              $or: [
                {
                  $regexMatch: {
                    input: {
                      $ifNull: ["$assignedTo.userProfile.fullName", ""],
                    },
                    regex: entityFilterRegex,
                  },
                },
                {
                  $regexMatch: {
                    input: {
                      $ifNull: ["$assignedTo.businessInfo.companyName", ""],
                    },
                    regex: entityFilterRegex,
                  },
                },
              ],
            },
          },
        });
      }

      basePipeline.push(
        { $sort: { createdAt: -1 } },
        { $skip: offset },
        { $limit: limit }
      );

      const fullPipeline =
        orderIdInitail !== "SELF"
          ? [
              {
                $match: {
                  orderId: { $regex: `^${orderIdInitail}`, $options: "i" },
                },
              },
              ...matchStages,
              ...basePipeline,
            ]
          : [...matchStages, ...basePipeline];

        const totalCountDateFilter =  {
            ...(pickupDateFrom || pickupDateTo
            ? {
            orderDate: {
              ...(pickupDateFrom ? { $gte: new Date(pickupDateFrom) } : {}),
              ...(pickupDateTo ? { $lte: new Date(pickupDateTo) } : {}),
               },
              }
            : {})
             }
             
          const totalCountAssignToFilter =  {
            ...(payload?.UserType === "T3PL" || payload?.UserType === "RIDER"
            ? {
            assignedTo: new ObjectId(payload?.userId)
            }
            : {})
             }
             
          
        
          
      const counters =
       (orderIdInitail === "SELF" || payload?.UserType == "T3PL" || payload?.UserType == "RIDER" || payload?.UserType == "STAFF" )
          ? [
              OrderModel.countDocuments({...totalCountDateFilter,...totalCountAssignToFilter}),
              OrderModel.countDocuments({ status: "ORDER PLACED",...totalCountDateFilter,...totalCountAssignToFilter }),
              OrderModel.countDocuments({ status: "IN TRANSIT" ,...totalCountDateFilter,...totalCountAssignToFilter}),
              OrderModel.countDocuments({ status: "ASSIGNED" ,...totalCountDateFilter,...totalCountAssignToFilter}),
              OrderModel.countDocuments({ status: "COMPLETED",...totalCountDateFilter,...totalCountAssignToFilter }),
              OrderModel.countDocuments({ status: "RETURNED",...totalCountDateFilter,...totalCountAssignToFilter }),
              OrderModel.countDocuments({ status: "FAILED",...totalCountDateFilter,...totalCountAssignToFilter }),
              OrderModel.countDocuments({ status: "REJECTED",...totalCountDateFilter,...totalCountAssignToFilter }),
            ]
          : [
              OrderModel.countDocuments({
                orderId: { $regex: `^${orderIdInitail}`, $options: "i" },
                ...totalCountDateFilter
              }),
              OrderModel.countDocuments({
                status: "ORDER PLACED",
                orderId: { $regex: `^${orderIdInitail}`, $options: "i" },
                ...totalCountDateFilter
              }),
              OrderModel.countDocuments({
                status: "IN TRANSIT",
                orderId: { $regex: `^${orderIdInitail}`, $options: "i" },
                ...totalCountDateFilter
              }),
              OrderModel.countDocuments({
                status: "ASSIGNED",
                orderId: { $regex: `^${orderIdInitail}`, $options: "i" },
                ...totalCountDateFilter
              }),
              OrderModel.countDocuments({
                status: "COMPLETED",
                orderId: { $regex: `^${orderIdInitail}`, $options: "i" },
                ...totalCountDateFilter
              }),
              OrderModel.countDocuments({
                status: "RETURNED",
                orderId: { $regex: `^${orderIdInitail}`, $options: "i" },
                ...totalCountDateFilter
              }),
              OrderModel.countDocuments({
                status: "FAILED",
                orderId: { $regex: `^${orderIdInitail}`, $options: "i" },
                ...totalCountDateFilter
              }),
              OrderModel.countDocuments({
                status: "REJECTED",
                orderId: { $regex: `^${orderIdInitail}`, $options: "i" },
                ...totalCountDateFilter
              }),
            ];

      const [
        orders,
        totalCount,
        totalNumberOfOrders,
        totalNumOfOderPlaced,
        totalNumOfInTransit,
        totalNumberOfAssigned,
        totalNumberOfCompleted,
        totalNumberOfReturned,
        totalNumberOfFailed,
        totalNumberOfRejected,
      ] = await Promise.all([
        OrderModel.aggregate(fullPipeline),
        OrderModel.aggregate([
          ...fullPipeline.filter(
            (stage) => !("$skip" in stage) && !("$limit" in stage)
          ),
          { $count: "totalCount" },
        ]).then((res) => res[0]?.totalCount || 0),
        ...counters,
      ]);


      return {
        totalNumberOfOrders,
        totalNumOfOderPlaced,
        totalNumOfInTransit,
        totalNumberOfAssigned,
        totalNumberOfCompleted,
        totalNumberOfReturned,
        totalNumberOfFailed,
        totalNumberOfRejected,
        data: orders,
        totalCount,
        hasNextPage: offset + limit < totalCount,
        currentPage: Math.floor(offset / limit) + 1,
      };
    },

    order: async (_: any, { id }: { id: String }) => {
      const order = await OrderModel.findById(id).populate("assignedTo");

      return order;
    },

    cod: async (
      _: any,
      {
        offset,
        limit,
        search,
        orderIds,
        pickupDateFrom,
        pickupDateTo,
        deliveryDateFrom,
        deliveryDateTo,
        vendorId,
        assignedTo,
      }: {
        offset: number;
        limit: number;
        search: string;

        orderIds: string[];
        pickupDateFrom: string;
        pickupDateTo: string;
        deliveryDateFrom: string;
        deliveryDateTo: string;
        vendorId: string;
        assignedTo: string;
      },
      { payload }: GraphContext
    ) => {
      let orderIdInitail = "SELF";

      if (payload?.UserType == "VENDOR") {
        const orderCounter = await OrderCounterModel.findOne({
          vendorId: payload?.userId,
        });

        if (orderCounter?.initials) {
          orderIdInitail = orderCounter.initials;
        }
      }

      if (offset < 0) throw new UserInputError("Offset cannot be negative");
      if (limit <= 0 || limit > 100)
        throw new UserInputError("Limit must be 1-100");

      const searchRegex = new RegExp(escapeRegex(search.trim()), "i");

      const matchStages: PipelineStage[] = [
        {
          $match: {
            $or: [
              {
                status: orderStatus.COMPLETED,
              },
              {
                status: orderStatus.FAILED,
              },
              {
                status: orderStatus.REJECTED,
              },
            ],
          },
        },
      ];

      if (orderIds.length > 0) {
        matchStages.push({
          $match: {
            orderId: { $in: orderIds },
          },
        });
      }

      if (pickupDateFrom && !pickupDateTo) {
        matchStages.push({
          $match: {
            orderDate: { $gte: new Date(pickupDateFrom) },
          },
        });
      }

      if (!pickupDateFrom && pickupDateTo) {
        matchStages.push({
          $match: {
            orderDate: { $lte: new Date(pickupDateTo) },
          },
        });
      }

      if (pickupDateFrom && pickupDateTo) {
        matchStages.push({
          $match: {
            orderDate: {
              $gte: new Date(pickupDateFrom),
              $lte: new Date(pickupDateTo),
            },
          },
        });
      }

      if (deliveryDateFrom && !deliveryDateTo) {
        matchStages.push({
          $match: {
            deliveryDate: { $gte: new Date(deliveryDateFrom) },
          },
        });
      }

      if (!deliveryDateFrom && deliveryDateTo) {
        matchStages.push({
          $match: {
            deliveryDate: { $lte: new Date(deliveryDateTo) },
          },
        });
      }

      if (deliveryDateFrom && deliveryDateTo) {
        matchStages.push({
          $match: {
            deliveryDate: {
              $gte: new Date(deliveryDateFrom),
              $lte: new Date(deliveryDateTo),
            },
          },
        });
      }

      if (assignedTo) {
        matchStages.push({
          $match: {
            assignedTo: new ObjectId(assignedTo),
          },
        });
      }

      if (vendorId === "SELF") {
        matchStages.push({
          $match: {
            "source.type": "SELF",
          },
        });
      } else if (vendorId && vendorId !== "SELF") {
        matchStages.push({
          $match: {
            "source.vendorID": new ObjectId(vendorId),
          },
        });
      }

      const basePipeline: PipelineStage[] = [
        {
          $lookup: {
            from: "Riders",
            localField: "assignedTo",
            foreignField: "_id",
            as: "riderDetails",
          },
        },

        {
          $lookup: {
            from: "T3PLS",
            localField: "assignedTo",
            foreignField: "_id",
            as: "t3plDetails",
          },
        },

        {
          $lookup: {
            from: "Vendors",
            localField: "source.vendorID",
            foreignField: "_id",
            as: "vendorDetails",
          },
        },

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
            source: {
              $cond: [
                { $eq: ["$source.type", "VENDOR"] },
                { $arrayElemAt: ["$vendorDetails", 0] },
                null,
              ],
            },
          },
        },

        {
          $project: {
            riderDetails: 0,
            t3plDetails: 0,
          },
        },
      ];

      const accumelator = [
        ...matchStages,
        {
          $group: {
            _id: null,
            completedOrderNum: {
              $sum: 1,
            },
            totalRevenue: {
              $sum: { $add: ["$paymentAmount", "$deliveryFee"] },
            },
            totalDeliveryFee: { $sum: "$deliveryFee" },
            pendingRemittance: {
              $sum: {
                $cond: [
                  { $ne: ["$paymentStatus", "PAID"] },
                  "$paymentAmount",
                  0,
                ],
              },
            },
            paidToVendor: {
              $sum: {
                $cond: [
                  { $eq: ["$paymentStatus", "PAID"] },
                  "$paymentAmount",
                  0,
                ],
              },
            },
          },
        },
      ];

      // matchStages.push(
      //   { $sort: { createdAt: -1 } },
      //   { $skip: offset },
      //   { $limit: limit }
      // );

      const [accumulatedValues, orders, totalCount] = await Promise.all([
        OrderModel.aggregate(accumelator),
        OrderModel.aggregate([
          ...matchStages,
          ...basePipeline,
          { $sort: { createdAt: -1 } },
          { $skip: offset },
          { $limit: limit },
        ]),
        OrderModel.aggregate([
          ...matchStages,
          ...basePipeline.filter(
            (stage) => !("$skip" in stage) && !("$limit" in stage)
          ),
          { $count: "totalCount" },
        ]).then((res) => res[0]?.totalCount || 0),
      ]);
    
      return {
        data: orders,
        totalCount,
        hasNextPage: offset + limit < totalCount,
        currentPage: Math.floor(offset / limit) + 1,
        ...accumulatedValues[0],
      };
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
