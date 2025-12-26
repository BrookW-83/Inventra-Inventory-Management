using InventoryManagement.Domain.Enums;

namespace InventoryManagement.Application.DTOs;

public class SectionCapacityDto
{
    public InventorySection Section { get; set; }
    public int TotalCapacity { get; set; }
    public int UsedCapacity { get; set; }
    public int RemainingCapacity { get; set; }
    public decimal UsagePercentage { get; set; }
}
