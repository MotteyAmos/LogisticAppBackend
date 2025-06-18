
export const generalTypeDefs = `#graphql

type Role {
    id: ID
    name: String
    permissions: [Permission]
    createdAt: DateTime
    updatedAt: DateTime
}

type Permission {
    id: ID
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



type Query{
    roles: [Role]
    permissions: [Permission]
}

`