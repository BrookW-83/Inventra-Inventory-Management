using InventoryManagement.Domain.Enums;

namespace InventoryManagement.Domain.Entities;

public class Purchase
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string PurchasedBy { get; set; } = string.Empty;
    public decimal TotalCost { get; set; }
    public PurchaseStatus Status { get; set; }
    public DateTime PurchaseDate { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public ICollection<PurchaseItem> PurchaseItems { get; set; } = new List<PurchaseItem>();
}
