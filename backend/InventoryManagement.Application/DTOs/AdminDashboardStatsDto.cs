namespace InventoryManagement.Application.DTOs;

public class AdminDashboardStatsDto
{
    // Overview Stats
    public int DailyRegisteredUsers { get; set; }
    public int DailyActiveUsers { get; set; }
    public int TotalUsers { get; set; }

    // User Analytics
    public int ActiveUsersCount { get; set; }
    public int InactiveUsersCount { get; set; }
    public List<UserActivityDto> TopActiveUsers { get; set; } = new();
    public List<RecentInventoryChangeDto> RecentInventoryChanges { get; set; } = new();

    // Operational Performance
    public decimal OrderFulfillmentRate { get; set; }
    public int BackorderCount { get; set; }
    public double AverageProcessingTimeMinutes { get; set; }
}

public class UserActivityDto
{
    public Guid UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public int InventoryUpdatesCount { get; set; }
    public DateTime LastActivityAt { get; set; }
}

public class RecentInventoryChangeDto
{
    public Guid UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string ItemName { get; set; } = string.Empty;
    public string Action { get; set; } = string.Empty;
    public int QuantityChanged { get; set; }
    public DateTime CreatedAt { get; set; }
}
