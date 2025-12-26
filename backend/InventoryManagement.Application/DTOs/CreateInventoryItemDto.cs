using InventoryManagement.Domain.Enums;

namespace InventoryManagement.Application.DTOs;

public class CreateInventoryItemDto
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public InventorySection Section { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
}
