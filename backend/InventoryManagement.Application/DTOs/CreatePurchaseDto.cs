namespace InventoryManagement.Application.DTOs;

public class CreatePurchaseDto
{
    public string PurchasedBy { get; set; } = string.Empty;
    public DateTime PurchaseDate { get; set; }
    public List<CreatePurchaseItemDto> PurchaseItems { get; set; } = new();
}
