
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




type Query{
    roles: [Role]
    permissions: [Permission]
}

`