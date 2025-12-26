using Microsoft.EntityFrameworkCore;
using InventoryManagement.Application.DTOs;
using InventoryManagement.Application.Interfaces;
using InventoryManagement.Domain.Entities;
using InventoryManagement.Domain.Enums;
using InventoryManagement.Infrastructure.Data;

namespace InventoryManagement.Infrastructure.Services;

public class PurchaseService : IPurchaseService
{
    private readonly IRepository<Purchase> _purchaseRepository;
    private readonly IRepository<InventoryItem> _inventoryRepository;
    private readonly AppDbContext _context;

    public PurchaseService(
        IRepository<Purchase> purchaseRepository,
        IRepository<InventoryItem> inventoryRepository,
        AppDbContext context)
    {
        _purchaseRepository = purchaseRepository;
        _inventoryRepository = inventoryRepository;
        _context = context;
    }

    public async Task<List<PurchaseDto>> GetAllAsync(Guid userId)
    {
        var purchases = await _context.Purchases
            .Where(p => p.UserId == userId)
            .Include(p => p.PurchaseItems)
            .ThenInclude(pi => pi.InventoryItem)
            .ToListAsync();

        return purchases.Select(MapToDto).ToList();
    }

    public async Task<List<PurchaseDto>> GetActivePurchasesAsync(Guid userId)
    {
        var purchases = await _context.Purchases
            .Where(p => p.UserId == userId && (p.Status == PurchaseStatus.Pending || p.Status == PurchaseStatus.Active))
            .Include(p => p.PurchaseItems)
            .ThenInclude(pi => pi.InventoryItem)
            .ToListAsync();

        return purchases.Select(MapToDto).ToList();
    }

    public async Task<PurchaseDto?> GetByIdAsync(Guid id, Guid userId)
    {
        var purchase = await _context.Purchases
            .Where(p => p.UserId == userId)
            .Include(p => p.PurchaseItems)
            .ThenInclude(pi => pi.InventoryItem)
            .FirstOrDefaultAsync(p => p.Id == id);

        return purchase == null ? null : MapToDto(purchase);
    }

    public async Task<PurchaseDto> CreateAsync(CreatePurchaseDto dto, Guid userId)
    {
        var purchase = new Purchase
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            PurchasedBy = dto.PurchasedBy,
            PurchaseDate = dto.PurchaseDate,
            Status = PurchaseStatus.Pending,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        decimal totalCost = 0;

        foreach (var itemDto in dto.PurchaseItems)
        {
            var purchaseItem = new PurchaseItem
            {
                Id = Guid.NewGuid(),
                PurchaseId = purchase.Id,
                ItemName = itemDto.ItemName,
                Description = itemDto.Description,
                Quantity = itemDto.Quantity,
                UnitPrice = itemDto.UnitPrice,
                TotalPrice = itemDto.UnitPrice * itemDto.Quantity,
                Section = itemDto.Section,
                AddedToInventory = false
            };

            totalCost += purchaseItem.TotalPrice;
            purchase.PurchaseItems.Add(purchaseItem);
        }

        purchase.TotalCost = totalCost;

        await _purchaseRepository.AddAsync(purchase);
        await _purchaseRepository.SaveChangesAsync();

        return (await GetByIdAsync(purchase.Id, userId))!;
    }

    public async Task<PurchaseDto?> CompleteAsync(Guid id, Guid userId)
    {
        var purchase = await _context.Purchases
            .Where(p => p.UserId == userId)
            .Include(p => p.PurchaseItems)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (purchase == null)
        {
            return null;
        }

        if (purchase.Status == PurchaseStatus.Completed)
        {
            return MapToDto(purchase);
        }

        foreach (var item in purchase.PurchaseItems.Where(pi => !pi.AddedToInventory))
        {
            var inventoryItem = new InventoryItem
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Name = item.ItemName,
                Description = item.Description,
                Quantity = item.Quantity,
                UnitPrice = item.UnitPrice,
                Section = item.Section,
                ImageUrl = string.Empty,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _inventoryRepository.AddAsync(inventoryItem);
            item.InventoryItemId = inventoryItem.Id;
            item.AddedToInventory = true;

            _context.InventoryLogs.Add(new InventoryLog
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                InventoryItemId = inventoryItem.Id,
                Action = "Purchase Completed",
                QuantityChanged = item.Quantity,
                PerformedBy = purchase.PurchasedBy,
                CreatedAt = DateTime.UtcNow
            });
        }

        purchase.Status = PurchaseStatus.Completed;
        purchase.UpdatedAt = DateTime.UtcNow;

        await _purchaseRepository.SaveChangesAsync();

        return MapToDto(purchase);
    }

    public async Task<bool> DeleteAsync(Guid id, Guid userId)
    {
        var purchase = await _purchaseRepository.GetByIdAsync(id);
        if (purchase == null || purchase.UserId != userId) return false;

        await _purchaseRepository.DeleteAsync(purchase);
        await _purchaseRepository.SaveChangesAsync();

        return true;
    }

    private static PurchaseDto MapToDto(Purchase purchase)
    {
        return new PurchaseDto
        {
            Id = purchase.Id,
            PurchasedBy = purchase.PurchasedBy,
            TotalCost = purchase.TotalCost,
            Status = purchase.Status,
            PurchaseDate = purchase.PurchaseDate,
            CreatedAt = purchase.CreatedAt,
            PurchaseItems = purchase.PurchaseItems.Select(pi => new PurchaseItemDto
            {
                Id = pi.Id,
                InventoryItemId = pi.InventoryItemId,
                ItemName = pi.InventoryItem?.Name ?? pi.ItemName,
                Description = string.IsNullOrEmpty(pi.Description) ? pi.InventoryItem?.Description ?? string.Empty : pi.Description,
                Quantity = pi.Quantity,
                UnitPrice = pi.UnitPrice,
                TotalPrice = pi.TotalPrice,
                Section = pi.Section,
                AddedToInventory = pi.AddedToInventory
            }).ToList()
        };
    }
}
