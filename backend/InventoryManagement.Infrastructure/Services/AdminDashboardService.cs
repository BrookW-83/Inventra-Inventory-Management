using Microsoft.EntityFrameworkCore;
using InventoryManagement.Application.DTOs;
using InventoryManagement.Application.Interfaces;
using InventoryManagement.Domain.Enums;
using InventoryManagement.Infrastructure.Data;

namespace InventoryManagement.Infrastructure.Services;

public class AdminDashboardService : IAdminDashboardService
{
    private readonly AppDbContext _context;

    public AdminDashboardService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<AdminDashboardStatsDto> GetAdminDashboardStatsAsync()
    {
        var today = DateTime.UtcNow.Date;
        var thirtyDaysAgo = today.AddDays(-30);

        // Get all profiles (users/organizations)
        var profiles = await _context.Profiles.ToListAsync();

        // Daily registered users
        var dailyRegisteredUsers = profiles.Count(p => p.CreatedAt.Date == today);

        // Total users
        var totalUsers = profiles.Count;

        // Get inventory logs for activity tracking
        var recentLogs = await _context.InventoryLogs
            .Include(l => l.InventoryItem)
            .Where(l => l.CreatedAt >= thirtyDaysAgo)
            .ToListAsync();

        // Daily active users (users with activity today)
        var dailyActiveUsers = recentLogs
            .Where(l => l.CreatedAt.Date == today)
            .Select(l => l.UserId)
            .Distinct()
            .Count();

        // Active vs inactive users (activity in last 30 days)
        var activeUserIds = recentLogs.Select(l => l.UserId).Distinct().ToHashSet();
        var activeUsersCount = activeUserIds.Count;
        var inactiveUsersCount = totalUsers - activeUsersCount;

        // Top active users by inventory updates
        var topActiveUsers = recentLogs
            .GroupBy(l => l.UserId)
            .Select(g => new UserActivityDto
            {
                UserId = g.Key,
                UserName = profiles.FirstOrDefault(p => p.Id == g.Key)?.Name ?? "Unknown",
                InventoryUpdatesCount = g.Count(),
                LastActivityAt = g.Max(l => l.CreatedAt)
            })
            .OrderByDescending(u => u.InventoryUpdatesCount)
            .Take(10)
            .ToList();

        // Recent inventory changes across all users
        var recentInventoryChanges = await _context.InventoryLogs
            .Include(l => l.InventoryItem)
            .OrderByDescending(l => l.CreatedAt)
            .Take(20)
            .ToListAsync();

        var recentChangesDto = recentInventoryChanges.Select(l => new RecentInventoryChangeDto
        {
            UserId = l.UserId,
            UserName = profiles.FirstOrDefault(p => p.Id == l.UserId)?.Name ?? "Unknown",
            ItemName = l.InventoryItem?.Name ?? "Unknown",
            Action = l.Action,
            QuantityChanged = l.QuantityChanged,
            CreatedAt = l.CreatedAt
        }).ToList();

        // Operational metrics from purchases
        var purchases = await _context.Purchases.ToListAsync();
        var completedPurchases = purchases.Count(p => p.Status == PurchaseStatus.Completed);
        var totalPurchases = purchases.Count;
        var orderFulfillmentRate = totalPurchases > 0
            ? (decimal)completedPurchases / totalPurchases * 100
            : 0;

        var backorderCount = purchases.Count(p => p.Status == PurchaseStatus.Pending);

        // Average processing time (from created to completed)
        var completedWithTime = purchases
            .Where(p => p.Status == PurchaseStatus.Completed)
            .Select(p => (p.UpdatedAt - p.CreatedAt).TotalMinutes)
            .ToList();
        var avgProcessingTime = completedWithTime.Any()
            ? completedWithTime.Average()
            : 0;

        return new AdminDashboardStatsDto
        {
            DailyRegisteredUsers = dailyRegisteredUsers,
            DailyActiveUsers = dailyActiveUsers,
            TotalUsers = totalUsers,
            ActiveUsersCount = activeUsersCount,
            InactiveUsersCount = inactiveUsersCount,
            TopActiveUsers = topActiveUsers,
            RecentInventoryChanges = recentChangesDto,
            OrderFulfillmentRate = orderFulfillmentRate,
            BackorderCount = backorderCount,
            AverageProcessingTimeMinutes = avgProcessingTime
        };
    }
}
