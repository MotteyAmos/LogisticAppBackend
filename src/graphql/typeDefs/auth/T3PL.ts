



export const T3plTypeDefs = `#graphql
    

    type T3PLBusinessInfo{
        companyName:String,
        businessDescription:String
        webApplicationDomainName:String
        businessAddress:String
        businessRegistrationNumber:String
        areaOfOperation: String
        yearsInOpertion: Int
        logo: String
        country_city: String
    }

    type T3PLContactDetails{
        phoneNumber:String,
        
        email:String,
        name:String
    }


   
    type Preference {
        enable2FA: Boolean
        enableEmailNotification: Boolean
    }

    type AuditingAndConfirmation{
        lastLogin: DateTime
        accountVerificationStatus: Boolean

    }

    type T3PL{
        _id:ID
        businessInfo: T3PLBusinessInfo
        contactDetails: T3PLContactDetails
        financialDetails: financialDetail
        role: String,
        status:String,
        preference: Preference
        auditing: AuditingAndConfirmation
    }

    type T3PLPositiveResult{
        data:[T3PL]
        totalCount:Int
        hasNextPage:Boolean
        currentPage:Int
    }

   

    type Query{
        T3pls(offset:Int!, limit:Int!, status:Status!, search:String!):T3PLPositiveResult
        T3pl(id:ID!): T3PL
    }

`;
