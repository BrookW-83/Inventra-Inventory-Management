using InventoryManagement.Domain.Enums;

namespace InventoryManagement.Application.DTOs;

public class CreatePurchaseItemDto
{
    public string ItemName { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public InventorySection Section { get; set; }
}
