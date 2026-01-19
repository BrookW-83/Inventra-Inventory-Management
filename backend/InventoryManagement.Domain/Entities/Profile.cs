namespace InventoryManagement.Domain.Entities;

// Profile entity for Supabase - extended with organization fields
public class Profile
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Role { get; set; } = "user";
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    // Basic Info
    public string? Description { get; set; }
    public string? ContactEmail { get; set; }

    // Extended Info
    public string? Phone { get; set; }
    public string? Address { get; set; }
    public string? Website { get; set; }
    public string? Industry { get; set; }

    // Comprehensive Info
    public string? LogoUrl { get; set; }
    public string? LinkedInUrl { get; set; }
    public string? TwitterUrl { get; set; }
    public string? FacebookUrl { get; set; }
    public string? BusinessHours { get; set; }
    public string? CompanySize { get; set; }
}
