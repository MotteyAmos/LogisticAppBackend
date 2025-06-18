


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
        id: ID
        userProfile: UserProfile
        role: Role
        preference: Preference
        auditingAndConfirmation: AuditingAndConfirmation

    }

    type Query{
        staffs: [Staff]
        staff(id: ID!): Staff
    }


`

// graphl getting on single 