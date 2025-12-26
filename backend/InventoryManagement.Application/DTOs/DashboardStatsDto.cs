namespace InventoryManagement.Application.DTOs;

public class DashboardStatsDto
{
    public int TotalInventoryCapacity { get; set; }
    public int UsedInventoryCapacity { get; set; }
    public int TotalItemsStored { get; set; }
    public decimal TotalSales { get; set; }
    public decimal TotalCostCurrentYear { get; set; }
    public List<SectionCapacityDto> SectionCapacities { get; set; } = new();
    public List<InventoryLogDto> RecentInventoryLogs { get; set; } = new();
    public List<PurchaseDto> RecentPurchases { get; set; } = new();
}
