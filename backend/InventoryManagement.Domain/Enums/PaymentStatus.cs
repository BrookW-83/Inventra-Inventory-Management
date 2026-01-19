namespace InventoryManagement.Domain.Enums;

public enum PaymentStatus
{
    NotRequired = 0,
    PendingPayment = 1,
    Paid = 2,
    Failed = 3,
    Refunded = 4
}
