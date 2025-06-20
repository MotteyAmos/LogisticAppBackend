export const vendorTypeDefs = `#graphql

    type VendorContactDetails{
        phoneNumber:String,
        email:String,
        name:String
    }

    type BusinessInfo{
        companyName:String,
        businessType:String,
        businessDescription:String
        webApplicationDomainName:String
        businessAddress:String
        businessRegistrationNumber:String
        areaOfOperation:String
        yearsInOpertion:Int
        logo:String
    }

   
    type Preference {
        enable2FA: Boolean
        enableEmailNotification: Boolean
    }

    type AuditingAndConfirmation{
        lastLogin: DateTime
        accountVerificationStatus: Boolean

    }

    type Vendor{
        _id:ID
        businessInfo: BusinessInfo
        contactDetails: VendorContactDetails
        financialDetails: financialDetail
        role: String,
        status:String,
        preference: Preference
        auditing: AuditingAndConfirmation
    }

    type VendorPositiveResult{
        data:[Vendor]
        totalCount:Int
        hasNextPage:Boolean
        currentPage:Int
    }

    type Query{
        vendors(offset:Int!, limit:Int!):VendorPositiveResult
        vendor(id:ID!): Vendor
    }

`;
