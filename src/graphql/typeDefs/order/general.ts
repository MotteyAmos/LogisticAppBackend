


export const generalOrderTypeDef = `#graphql
    type Location {
        lat:Float
        lng:Float
    }

    type OrderSource{
        type:String 
        vendorID:ID
    }

 
    union AssignedTo = Rider | T3PL


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
        paymentStatus:String
        deliveryFee: Float
        status:String
        source: OrderSource
        assignedTo:AssignedTo 
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