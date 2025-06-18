

export enum orderStatus {
    PENDING = "PENDING",
    COMPLETED = "COMPLETED",
    ORDER_FAILED = "ORDER_FAILED",
    ORDER_REJECTED = "ORDER_REJECTED",
    IN_TRANSIT = "IN_TRANSIT",
    ORDER_ASSIGNED ="ORDER_ASSIGNED",
    ORDER_RETURNED = "ORDER_RETURNED"
}

export enum OrderAssignedTo{
    T3PL = "3PL",
    RIDER = "RIDER"
}

export enum OrderSource{
    VENDOR="VENDOR",
    SELF="SELF"
}