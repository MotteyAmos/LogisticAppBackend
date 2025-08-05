import { PipelineStage } from "mongoose";
import RiderModel from "../../../database/models/auth/RiderModel";
import { accountStatus } from "../../../rest-api/enum/general";
import { escapeRegex } from "../../../rest-api/utils/general";
import { ServerError, UserInputError } from "../../utils/catch-error";

export const riderResolvers = {
  Query: {
   riders: async (
      _: any,
      { offset, limit, status,search }: { offset: number; limit: number;  status:"APPROVED"|"PENDING"| "DENIED"; search:string }
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

      

     

      try {
      const searchRegex = new RegExp(escapeRegex(search?.trim()), "i");

         const filterBy: PipelineStage[] = [
                {
                  $match: {
                    $expr: {
                      $or: [
                        // Full name search (handles missing middleName)
                        {
                          $regexMatch: {
                            input: "$userProfile.fullName",
                            regex: searchRegex,
                          },
                        },
        
                        {
                          $regexMatch: {
                            input: "$contactDetails.phoneNumber",
                            regex: searchRegex,
                          },
                        },
                        {
                          $regexMatch: {
                            input: "$vehicleInfo.vehicleType",
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
        
              const [riders, totalCount] =
                      search.trim().length == 0
                        ? await Promise.all([
                            RiderModel.find({status})
                              .sort({ createdAt: -1 })
                              .skip(offset)
                              .limit(limit)
                              .lean(),
                            RiderModel.countDocuments({status}),
                          ])
                        : await Promise.all([
                            RiderModel.aggregate(filterBy),
                            RiderModel.countDocuments({status}),
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
