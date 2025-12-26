using InventoryManagement.Domain.Enums;

namespace InventoryManagement.Application.DTOs;

public class PurchaseItemDto
{
    public Guid Id { get; set; }
    public Guid? InventoryItemId { get; set; }
    public string ItemName { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal TotalPrice { get; set; }
    public InventorySection Section { get; set; }
    public bool AddedToInventory { get; set; }
}
