


export const staffTypeDefs = `#graphql

    type FullName{
        surname: String
        firstName: String
        middleName: String
    }

    type UserProfile{
        fullName:FullName
        gender: String
        email: String
        contact: String
        picture: String

    }

    type Preference{
        enable2FA: Boolean
        enableEmailNotification: Boolean
    }

    type AuditingAndConfirmation{
        emailVarification: Boolean
        lastLogin: DateTime
    }

    type Staff {
        _id: ID
        userProfile: UserProfile
        role: Role
        preference: Preference
        auditingAndConfirmation: AuditingAndConfirmation
        createdAt: Date
    }
    
    type StaffPositiveResult{
        data:[Staff]
        totalCount: Int
        hasNextPage: Boolean
        currentPage: Int
    }

    type Query{
        staffs(offset:Int!, limit:Int!): StaffPositiveResult
        staff(id: ID!): Staff
    }


`

// graphl getting on single 