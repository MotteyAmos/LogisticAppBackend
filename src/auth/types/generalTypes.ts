
export interface fullName{
    surname: String,
    firstName: String,
    middleName: String
}


export interface contactDetils{
    phoneNumber: String,
    email: String
}

export interface address {
    region: String,
    country: String,
    town: String,
    GPS_Address: String,
    nationalIdentification:{
        type:String,
        value: String
    }
}


export interface emergencyInfo {
    name: String,
    relationship: String,
    phoneNunber: String
}


export interface userProfile {
    fullName:fullName,
    contactDetils: contactDetils,
    address: address,
    emergencyInfo: emergencyInfo,
    password: String
}

export interface financialInfo {
    bankAccountDetails: {
        accountNumber: String,
        recipientName: String
    },
    mobileMoneyAccount:{
        phoneNumber: String,
        recipientName: String
    }
}



export interface preference {
    enable2FA:boolean,
    enableEmailNotification: boolean;
    twoFactorSecret: string
}