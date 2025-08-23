

export enum orderStatus {
    ORDER_PLACED = "ORDER PLACED",
    IN_TRANSIT = "IN TRANSIT",
    ASSIGNED = "ASSIGNED",
    COMPLETED = "COMPLETED",
    RETURNED = "RETURNED",
    FAILED = "FAILED",
    REJECTED = "REJECTED"
}

export enum PaymentStatus{
    PENDING = "PENDING",
    PAID = "PAID"
}

export enum OrderAssignedTo{
    T3PL = "3PL",
    RIDER = "RIDER"
}

export enum OrderSource{
    VENDOR="VENDOR",
    SELF="SELF"
}