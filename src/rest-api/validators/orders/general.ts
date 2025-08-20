import { z } from "zod";
import { OrderAssignedTo, OrderSource, orderStatus } from "../../enum/orders";



export const addSingleOrderSchema =  z.object({
  destination: z.string(),
  productDescription: z.string().optional(),
  location: z
    .object({
      lat: z.number(),
      lng: z.number(),
    })
    .optional(),

  recipientName: z.string({ required_error: "Recipient name required" }),
  recipientNumber: z.string({
    required_error: "Recipient phone number required",
  }),

  paymentAmount: z.string({ required_error: "Payment amount required" }),
  deliveryFee: z.string({ required_error: "Delivery fee required" }).optional(),

  source: z.object({
    type: z.nativeEnum(OrderSource),
    vendorID: z.string().optional(),
  }),


  // assignedTo: z.string({
  //         required_error:
  //           "Provide the id of the entity you want to assign order to (3PL | Rider) id",
  //       })
  //       .length(24, { message: "Invalid (3PL or Rider) id" }).optional()
    

  // productImage:z.string().optional()
  //  z
  //   .object({
  //     imageFile: z.string().optional(),
  //     imageUrl: z.string().optional(),
  //   })
  //   .optional(),
})



export const addOrderSchema =z.array(addSingleOrderSchema
)



export const updateOrderSchema = z.array(
  z.object({
    id:z.string(),
    orderId:z.string(),
    destination: z.string().optional(),
    productDescription: z.string().optional(),
    location: z.object({
      lat: z.number().optional(),
      lng: z.number().optional()
    }).optional(),
    recipient: z.string().optional(),
    recipientNumber: z.string().optional(),
    paymentAmount: z.number().optional(),
    deliveryFee: z.number().optional(),
    source: z.object({
      type: z.nativeEnum(OrderSource).optional(),
      vendorID: z.string().optional()
    }).optional(),
    status:z.nativeEnum(orderStatus).optional(),
    deliveryDate:z.string().optional(),
    rejectedReason:z.string().optional(),
    assignedTo: z.object({
      type: z.nativeEnum(OrderAssignedTo).optional(),
      entityAssignedId: z.string().length(24, {
        message: "Invalid ID length "
      }).optional()
    }).optional(),
    productImage: z.object({
      imageFile: z.string().optional(),
      imageUrl: z.string().optional()
    }).optional(),
    
  })
);

export const deleteOrderSchema = z.array(
  z.object({
    id:z.string(),
    orderId:z.string()
  })
)

export const assignToSchema = z.object({
  orderId: z.string().length(24, {
        message: "Invalid ID  "
      }),
  deliveryFee: z.number({required_error:"Delivery fee is required"}),

  assignToID: z.string().length(24, {
        message: "Invalid ID  "
      }),
  assignToModelName: z.enum(["T3PL","Rider"])
})


export const orderDeliveredSchema = z.object({
  orderId:z.string().length(24, {
        message: "Invalid ID  "
      }),
   otpCode: z.string()   
})

export const orderFailedSchema = z.object({
  orderId:z.string().length(24, {
        message: "Invalid ID  "
      }),
   remark: z.string().min(1,"remark is required")   
})

