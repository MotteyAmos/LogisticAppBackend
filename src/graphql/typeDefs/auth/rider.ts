

export const riderTypeDefs = `#graphql

    type RiderNationalID{
        type:String
        number:String
        image:String
    }


    type RiderProfile{
        fullName:String
        gender: String
        dateOfBirth: Date 
        picture: String 
        nationalIdentification:RiderNationalID
    }

    type RiderContactDetails{
        phoneNumber:String 
        additionalPhoneNumber:String 
        email:String 
        residentailAddress:String 
        emergencyContactName:String
        emergencyContactNumber: String 
    }

    type ProfessionalDetails{
        drivingLicenseImg:String 
        yearsOfDrivingExperience:Int 
        driverLicenseNumber: String
    }

    type VehicleInfo{
        vehicleType:String 
        registrationNumber: String 
    }

    type Rider{
        _id: ID
        userProfile: RiderProfile
        contactDetails: RiderContactDetails
        financialDetails: financialDetail 
        preference: Preference
        auditingAndConfirmation: AuditingAndConfirmation
        professionalDetails: ProfessionalDetails
        vehicleInfo: VehicleInfo
        createdAt: DateTime
    }

       type RiderPositiveResult{
        data:[Rider]
        totalCount: Int
        hasNextPage: Boolean
        currentPage: Int
    }

    type Query{
        riders(offset:Int!, limit:Int!, status:Status!): RiderPositiveResult
        rider(id: ID!): Rider
    }

    


`







