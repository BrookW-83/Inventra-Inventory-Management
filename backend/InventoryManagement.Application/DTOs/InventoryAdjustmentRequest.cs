namespace InventoryManagement.Application.DTOs;

public class InventoryAdjustmentRequest
{
    public int Quantity { get; set; }
    public string PerformedBy { get; set; } = string.Empty;
    public string Reason { get; set; } = "Stock adjustment";
}
