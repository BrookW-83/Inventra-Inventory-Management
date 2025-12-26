using InventoryManagement.Domain.Enums;

namespace InventoryManagement.Application.DTOs;

public class PurchaseDto
{
    public Guid Id { get; set; }
    public string PurchasedBy { get; set; } = string.Empty;
    public decimal TotalCost { get; set; }
    public PurchaseStatus Status { get; set; }
    public DateTime PurchaseDate { get; set; }
    public DateTime CreatedAt { get; set; }
    public List<PurchaseItemDto> PurchaseItems { get; set; } = new();
}
