namespace InventoryManagement.Domain.Entities;

public class InventoryLog
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public Guid InventoryItemId { get; set; }
    public InventoryItem InventoryItem { get; set; } = null!;
    public string Action { get; set; } = string.Empty;
    public int QuantityChanged { get; set; }
    public string PerformedBy { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}
