namespace InventoryManagement.Domain.Entities;

// Simplified Profile entity for Supabase
public class Profile
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Role { get; set; } = "user";
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
