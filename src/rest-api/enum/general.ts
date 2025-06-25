export enum Role {
  STAFF = "STAFF",
  VENDOR = "VENDOR",
  T3PL = "3PL",
  RIDER = "RIDER"

}

export enum AdminRole {
  DISPATCHER = "DISPATCHER",
  ADMIN = "ADMIN",
  FINANCE = "FINANCE",
  CUSTOMER_SERVICE = "CUSTOMER_SERVICE",
}

export enum Permissions {
  DISPATCH = "Dispatch",
  ASSIGN_DELIVERY = "Assign delivery",
  RESCHEDULE_DELIVERY = "Change delivery date (reschedule)",
  ASSIGN_DISPATCH_3PL = "Assigning and dispatching orders via delivery date and assigning to 3PLs or rider",
  COMPLETE_ORDER = "Complete orders or mark as delivered",
  BOOK_ORDERS = "Book or create new orders",
  CHANGE_ORDER_STATUS = 'Change order statuses (excluding "delivered" or "completed" for some roles)',
  SUM_TOTAL_COMPLETED = "Sum up total amount of completed orders (filtered by date, vendor, or rider/3PL)",
  MARK_PAID_VENDOR = 'Mark orders as "Paid to Vendor" (Finance only)',
  EXPORT_COMPLETED_TO_EXCEL = "Export filtered completed orders by vendor to Excel",
  DEFAULT="No permission"
}

export enum accountVerificationStatus {
  PENDING = "PENDING",
  VERIFIED = "VERIFIED",
}

export enum accountStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export enum ApproveStatus{
  DENIED = "DENIED",
  APPROVE = "APPROVE"
}

export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
}

export enum HumanRelationship {
  // ===== FAMILIAL =====
  FATHER = "FATHER",
  MOTHER = "MOTHER", // Parent ↔ Child
  SIBLING = "SIBLING", // Brother/Sister
  SPOUSE = "SPOUSE", // Husband/Wife/Spouse
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
  HUSBAND = "HUSBAND",
  FIANCE = "FIANCE", // Engaged
  EX_PARTNER = "EX_PARTNER", // Former romantic partner
  LOVER = "LOVER", // Non-committed romantic

  // ===== SOCIAL =====
  FRIEND = "FRIEND",
  BEST_FRIEND = "BEST_FRIEND",
  ACQUAINTANCE = "ACQUAINTANCE",
  NEIGHBOR = "NEIGHBOR",
}
