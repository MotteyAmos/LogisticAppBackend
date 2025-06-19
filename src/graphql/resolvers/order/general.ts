import OrderModel from "../../../database/models/orders/orderModule";

export const orderResolvers = {
  Query: {
    orders: async (
      _: any,
      { offset, limit }: { offset: number; limit: number }
    ) => {
   
    const [orders, totalCount] = await Promise.all([
            OrderModel.find().sort({ createdAt: -1 }).skip(offset*limit).limit(limit).lean()
            ,OrderModel.countDocuments() ]);

    const calOffset = offset ==0 ? 1 :offset

     return {
        orders,
        totalCount,
        hasNextPage: calOffset < totalCount,
        currentPage: Math.floor((offset*limit) / limit) + 1,
      };
      
    },

    order: async (_: any, { id }: { id: String }) => {
      const order = await OrderModel.findOne({ _id: id });
      return order;
    },
  },
};
