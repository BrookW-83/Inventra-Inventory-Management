using Microsoft.AspNetCore.Mvc;
using InventoryManagement.Infrastructure.Data;
using InventoryManagement.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace InventoryManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;

    public AuthController(AppDbContext context)
    {
        _context = context;
    }

    // This endpoint is only for getting/updating profile info
    // Actual authentication is handled by Supabase Auth

    [HttpGet("profile")]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public async Task<IActionResult> GetProfile()
    {
        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value
                          ?? User.FindFirst("sub")?.Value;

        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out Guid userId))
        {
            return Unauthorized();
        }

        var profile = await _context.Profiles.FindAsync(userId);

        if (profile == null)
        {
            return NotFound(new { message = "Profile not found" });
        }

        return Ok(new
        {
            id = profile.Id,
            name = profile.Name,
            createdAt = profile.CreatedAt,
            updatedAt = profile.UpdatedAt
        });
    }

    [HttpPut("profile")]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequest request)
    {
        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value
                          ?? User.FindFirst("sub")?.Value;

        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out Guid userId))
        {
            return Unauthorized();
        }

        var profile = await _context.Profiles.FindAsync(userId);

        if (profile == null)
        {
            return NotFound(new { message = "Profile not found" });
        }

        if (!string.IsNullOrWhiteSpace(request.Name))
        {
            profile.Name = request.Name;
        }

        profile.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return Ok(new
        {
            id = profile.Id,
            name = profile.Name,
            updatedAt = profile.UpdatedAt
        });
    }
}

public class UpdateProfileRequest
{
    public string Name { get; set; } = string.Empty;
}
