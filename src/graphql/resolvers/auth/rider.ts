import RiderModel from "../../../database/models/auth/RiderModel";
import { accountStatus } from "../../../rest-api/enum/general";
import { ServerError, UserInputError } from "../../utils/catch-error";

export const riderResolvers = {
  Query: {
   riders: async (
      _: any,
      { offset, limit, status }: { offset: number; limit: number; status: "APPROVED" | "PENDING" }
    ) => {
     
      if (offset < 0) {
        throw new UserInputError('Offset cannot be negative', {
          argumentName: 'offset',
        });
      }
      
      if (limit <= 0 || limit > 100) {
        throw new UserInputError('Limit must be between 1 and 100', {
          argumentName: 'limit',
          limitValue: limit,
        });
      }

      
      let accountStatusValue;
      switch (status) {
        case "APPROVED":
          accountStatusValue = accountStatus.ACTIVE;
          break;
        case "PENDING":
          accountStatusValue = accountStatus.INACTIVE;
          break;
        default:
          throw new UserInputError('Invalid status value', {
            validValues: ["APPROVED", "PENDING"],
          });
      }

      try {
        const [riders, totalCount] = await Promise.all([
          RiderModel.find({ status: accountStatusValue })
            .sort({ createdAt: -1 })
            .skip(offset)
            .limit(limit)
            .lean(),
          RiderModel.countDocuments({ status: accountStatusValue })
        ]);

        return {
          data: riders,
          totalCount,
          hasNextPage: offset + limit < totalCount,
          currentPage: Math.floor(offset / limit) + 1,
        };
      } catch (error) {
        throw new ServerError()
      }
    },

    rider: async (_: any, { id }: { id: String }) => {
      const rider = await RiderModel.findById(id);
      return rider;
    },
  },
};
