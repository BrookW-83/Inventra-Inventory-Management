using Microsoft.EntityFrameworkCore;
using InventoryManagement.Application.DTOs;
using InventoryManagement.Application.Interfaces;
using InventoryManagement.Infrastructure.Data;

namespace InventoryManagement.Infrastructure.Services;

public class AdminUserService : IAdminUserService
{
    private readonly AppDbContext _context;

    public AdminUserService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<AdminUserDto>> GetAllUsersAsync()
    {
        var profiles = await _context.Profiles.ToListAsync();

        var inventoryItemCounts = await _context.InventoryItems
            .GroupBy(i => i.UserId)
            .Select(g => new { UserId = g.Key, Count = g.Count() })
            .ToDictionaryAsync(x => x.UserId, x => x.Count);

        var purchaseCounts = await _context.Purchases
            .GroupBy(p => p.UserId)
            .Select(g => new { UserId = g.Key, Count = g.Count() })
            .ToDictionaryAsync(x => x.UserId, x => x.Count);

        var lastActivities = await _context.InventoryLogs
            .GroupBy(l => l.UserId)
            .Select(g => new { UserId = g.Key, LastActivity = g.Max(l => l.CreatedAt) })
            .ToDictionaryAsync(x => x.UserId, x => x.LastActivity);

        return profiles.Select(p => new AdminUserDto
        {
            Id = p.Id,
            Name = p.Name,
            Role = p.Role,
            CreatedAt = p.CreatedAt,
            UpdatedAt = p.UpdatedAt,
            TotalInventoryItems = inventoryItemCounts.GetValueOrDefault(p.Id, 0),
            TotalPurchases = purchaseCounts.GetValueOrDefault(p.Id, 0),
            LastActivityAt = lastActivities.GetValueOrDefault(p.Id)
        }).ToList();
    }

    public async Task<AdminUserDto?> GetUserByIdAsync(Guid userId)
    {
        var profile = await _context.Profiles.FindAsync(userId);
        if (profile == null) return null;

        var inventoryCount = await _context.InventoryItems.CountAsync(i => i.UserId == userId);
        var purchaseCount = await _context.Purchases.CountAsync(p => p.UserId == userId);
        var lastActivity = await _context.InventoryLogs
            .Where(l => l.UserId == userId)
            .OrderByDescending(l => l.CreatedAt)
            .Select(l => (DateTime?)l.CreatedAt)
            .FirstOrDefaultAsync();

        return new AdminUserDto
        {
            Id = profile.Id,
            Name = profile.Name,
            Role = profile.Role,
            CreatedAt = profile.CreatedAt,
            UpdatedAt = profile.UpdatedAt,
            TotalInventoryItems = inventoryCount,
            TotalPurchases = purchaseCount,
            LastActivityAt = lastActivity
        };
    }

    public async Task<AdminUserDto?> UpdateUserAsync(Guid userId, UpdateUserDto dto)
    {
        var profile = await _context.Profiles.FindAsync(userId);
        if (profile == null) return null;

        if (!string.IsNullOrWhiteSpace(dto.Name))
            profile.Name = dto.Name;
        if (!string.IsNullOrWhiteSpace(dto.Role))
            profile.Role = dto.Role;

        profile.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return await GetUserByIdAsync(userId);
    }

    public async Task<bool> DeleteUserAsync(Guid userId)
    {
        var profile = await _context.Profiles.FindAsync(userId);
        if (profile == null) return false;

        _context.Profiles.Remove(profile);
        await _context.SaveChangesAsync();
        return true;
    }
}
