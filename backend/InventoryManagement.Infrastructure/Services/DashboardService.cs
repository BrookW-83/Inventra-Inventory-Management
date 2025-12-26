using Microsoft.EntityFrameworkCore;
using InventoryManagement.Application.DTOs;
using InventoryManagement.Application.Interfaces;
using InventoryManagement.Domain.Enums;
using InventoryManagement.Infrastructure.Data;

namespace InventoryManagement.Infrastructure.Services;

public class DashboardService : IDashboardService
{
    private readonly AppDbContext _context;

    public DashboardService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<DashboardStatsDto> GetDashboardStatsAsync(Guid userId)
    {
        const int totalCapacityPerSection = 1000;

        var inventoryItems = await _context.InventoryItems
            .Where(i => i.UserId == userId)
            .ToListAsync();
        var purchases = await _context.Purchases
            .Where(p => p.UserId == userId)
            .Include(p => p.PurchaseItems)
            .ToListAsync();
        var inventoryLogs = await _context.InventoryLogs
            .Where(l => l.UserId == userId)
            .Include(l => l.InventoryItem)
            .OrderByDescending(l => l.CreatedAt)
            .Take(10)
            .ToListAsync();

        var totalUsedCapacity = inventoryItems.Sum(i => i.Quantity);
        var currentYear = DateTime.UtcNow.Year;
        var totalCostCurrentYear = purchases
            .Where(p => p.PurchaseDate.Year == currentYear)
            .Sum(p => p.TotalCost);

        var sectionCapacities = Enum.GetValues<InventorySection>()
            .Select(section =>
            {
                var usedCapacity = inventoryItems
                    .Where(i => i.Section == section)
                    .Sum(i => i.Quantity);

                return new SectionCapacityDto
                {
                    Section = section,
                    TotalCapacity = totalCapacityPerSection,
                    UsedCapacity = usedCapacity,
                    RemainingCapacity = totalCapacityPerSection - usedCapacity,
                    UsagePercentage = (decimal)usedCapacity / totalCapacityPerSection * 100
                };
            })
            .ToList();

        var recentPurchases = purchases
            .OrderByDescending(p => p.CreatedAt)
            .Take(5)
            .Select(p => new PurchaseDto
            {
                Id = p.Id,
                PurchasedBy = p.PurchasedBy,
                TotalCost = p.TotalCost,
                Status = p.Status,
                PurchaseDate = p.PurchaseDate,
                CreatedAt = p.CreatedAt,
                PurchaseItems = p.PurchaseItems.Select(pi => new PurchaseItemDto
                {
                    Id = pi.Id,
                    InventoryItemId = pi.InventoryItemId,
                    ItemName = pi.InventoryItem?.Name ?? pi.ItemName,
                    Description = pi.InventoryItem?.Description ?? pi.Description,
                    Quantity = pi.Quantity,
                    UnitPrice = pi.UnitPrice,
                    TotalPrice = pi.TotalPrice,
                    Section = pi.Section,
                    AddedToInventory = pi.AddedToInventory
                }).ToList()
            })
            .ToList();

        var recentInventoryLogs = inventoryLogs.Select(l => new InventoryLogDto
        {
            Id = l.Id,
            InventoryItemId = l.InventoryItemId,
            ItemName = l.InventoryItem?.Name ?? "Inventory Item",
            Action = l.Action,
            QuantityChanged = l.QuantityChanged,
            PerformedBy = l.PerformedBy,
            CreatedAt = l.CreatedAt
        }).ToList();

        return new DashboardStatsDto
        {
            TotalInventoryCapacity = totalCapacityPerSection * Enum.GetValues<InventorySection>().Length,
            UsedInventoryCapacity = totalUsedCapacity,
            TotalItemsStored = inventoryItems.Count,
            TotalSales = purchases.Sum(p => p.TotalCost),
            TotalCostCurrentYear = totalCostCurrentYear,
            SectionCapacities = sectionCapacities,
            RecentInventoryLogs = recentInventoryLogs,
            RecentPurchases = recentPurchases
        };
    }
}
