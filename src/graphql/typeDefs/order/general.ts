


export const generalOrderTypeDef = `#graphql

    type Location {
        lat:Float
        lng:Float
    }

    type OrderSource{
        type:String 
        vendorID:ID
    }

    type OrderAssignedTo{
        type:String
        entityAssignedId:ID
    }

    type Order{
        _id:ID
        orderDate:DateTime
        orderId:ID
        destination:String
        productDescription:String
        location:Location
        recipientName:String
        recipientNumber:String
        paymentNumber:String
        paymentAmount:Float 
        deliveryFee: Float
        status:String
        source: OrderSource
        assignedTo:OrderAssignedTo
        deliveryDate: DateTime 
        productImage:String 
        rejectedReasons:String 
        updatedAt:DateTime
        createdAt: DateTime
    }

    type OrdersPositiveResult {
        data: [Order]
        totalCount: Int 
        hasNextPage: Boolean  
        currentPage: Int
    }

    type Query{
        orders(offset:Int!, limit:Int!, search: String!):OrdersPositiveResult
        order(id:ID!):Order
    }


`