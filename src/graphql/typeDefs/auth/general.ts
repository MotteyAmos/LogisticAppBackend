
export const generalTypeDefs = `#graphql

type Role {
    _id: ID
    name: String
    description:String
    permissions: [Permission]
    assignTo:[Staff]
    createdAt: DateTime
    updatedAt: DateTime
}

type Permission {
    _id: ID
    name: String
    description: String
    createdAt: DateTime
    updatedAt: DateTime
}

 type BankAccountDetails{
        bankName:String
        accountNumber:String
        recipientName: String
    }

    type MobileMoneyAccount{
        phoneNumber:String,
        recipientName:String
    }
    type financialDetail {
        bankAccountDetails: BankAccountDetails
        mobileMoneyAccount: MobileMoneyAccount
    }

     enum Status{
        APPROVED
        PENDING
        DENIED
    }

    type RolePositiveResult{
        data:[Role]
        totalCount:Int
        hasNextPage: Boolean
        currentPage: Int
    }


type Query{
    roles(offset:Int!, limit:Int!): RolePositiveResult
    permissions: [Permission]
}

`