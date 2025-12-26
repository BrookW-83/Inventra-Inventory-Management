namespace InventoryManagement.Application.DTOs;

public class InventoryLogDto
{
    public Guid Id { get; set; }
    public Guid InventoryItemId { get; set; }
    public string ItemName { get; set; } = string.Empty;
    public string Action { get; set; } = string.Empty;
    public int QuantityChanged { get; set; }
    public string PerformedBy { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}
