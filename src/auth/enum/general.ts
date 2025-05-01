export enum Role{
    SUPER_ADMIN="SUPER_ADMIN",
    DISPATCHER="DISPATCHER",
    ADMIN="ADMIN",
    VENDOR="VENDOR",
    T3PL="3PL"
}


export enum accountVerificationStatus{
    PENDING="PENDING",
    VERIFIED="VERIFIED"
}

export enum accountStatus{
    ACTIVE="ACTIVE",
    INACTIVE="INACTIVE"
}

export enum Gender{
    MALE="MALE",
    FEMALE="MALE"
}

export enum HumanRelationship {
    // ===== FAMILIAL =====
    FATHER = "FATHER",
    MOTHER = "MOTHER",         // Parent ↔ Child
    SIBLING = "SIBLING",                   // Brother/Sister
    SPOUSE = "SPOUSE",                     // Husband/Wife/Spouse
    GRANDFATHER = "GRANDFATHER",
    GRANDMOTHER = "GRANDMOTHER",
    AUNTY = "AUNTY",
    UNCLE = "UNCLE",
    NIECE = "NIECE",
    NEPHEW = "NEPHEW",
    COUSIN = "COUSIN",
    STEP_MOTHER = "STEP_MOTHER",
    STEP_FATHER = "STEP_FATHER",
    GODFATHER = "GODFATHER",
    GODMOHER = "GODMOTHER",
    FOSTERFATHER = "FOSTERFATHER",
    FOSTERMOTHER = "FOSTERMOTHER",
    
    // ===== ROMANTIC =====
    WIFE = "WIFE", 
    HUSBAND= "HUSBAND",                  
    FIANCE = "FIANCE",                     // Engaged
    EX_PARTNER = "EX_PARTNER",             // Former romantic partner
    LOVER = "LOVER",                       // Non-committed romantic
  
    // ===== SOCIAL =====
    FRIEND = "FRIEND",
    BEST_FRIEND = "BEST_FRIEND",
    ACQUAINTANCE = "ACQUAINTANCE",
    NEIGHBOR = "NEIGHBOR",

  }