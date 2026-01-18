namespace InventoryManagement.Application.DTOs;

public class AdminUserDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    // Computed stats
    public int TotalInventoryItems { get; set; }
    public int TotalPurchases { get; set; }
    public DateTime? LastActivityAt { get; set; }
}

public class UpdateUserDto
{
    public string? Name { get; set; }
    public string? Role { get; set; }
}
