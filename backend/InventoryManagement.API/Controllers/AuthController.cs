using Microsoft.AspNetCore.Mvc;
using InventoryManagement.Infrastructure.Data;
using InventoryManagement.Domain.Entities;
using InventoryManagement.Application.DTOs;
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

        return Ok(new ProfileDto
        {
            Id = profile.Id,
            Name = profile.Name,
            Role = profile.Role,
            CreatedAt = profile.CreatedAt,
            UpdatedAt = profile.UpdatedAt,
            Description = profile.Description,
            ContactEmail = profile.ContactEmail,
            Phone = profile.Phone,
            Address = profile.Address,
            Website = profile.Website,
            Industry = profile.Industry,
            LogoUrl = profile.LogoUrl,
            LinkedInUrl = profile.LinkedInUrl,
            TwitterUrl = profile.TwitterUrl,
            FacebookUrl = profile.FacebookUrl,
            BusinessHours = profile.BusinessHours,
            CompanySize = profile.CompanySize
        });
    }

    [HttpPut("profile")]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateOrganizationProfileDto request)
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

        // Role-based access: Only organization users (non-admin) can update organization profile fields
        if (profile.Role == "admin")
        {
            return Forbid();
        }

        // Update fields if provided
        if (!string.IsNullOrWhiteSpace(request.Name))
            profile.Name = request.Name;

        // Basic Info
        if (request.Description != null)
            profile.Description = request.Description;
        if (request.ContactEmail != null)
            profile.ContactEmail = request.ContactEmail;

        // Extended Info
        if (request.Phone != null)
            profile.Phone = request.Phone;
        if (request.Address != null)
            profile.Address = request.Address;
        if (request.Website != null)
            profile.Website = request.Website;
        if (request.Industry != null)
            profile.Industry = request.Industry;

        // Comprehensive Info
        if (request.LogoUrl != null)
            profile.LogoUrl = request.LogoUrl;
        if (request.LinkedInUrl != null)
            profile.LinkedInUrl = request.LinkedInUrl;
        if (request.TwitterUrl != null)
            profile.TwitterUrl = request.TwitterUrl;
        if (request.FacebookUrl != null)
            profile.FacebookUrl = request.FacebookUrl;
        if (request.BusinessHours != null)
            profile.BusinessHours = request.BusinessHours;
        if (request.CompanySize != null)
            profile.CompanySize = request.CompanySize;

        profile.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return Ok(new ProfileDto
        {
            Id = profile.Id,
            Name = profile.Name,
            Role = profile.Role,
            CreatedAt = profile.CreatedAt,
            UpdatedAt = profile.UpdatedAt,
            Description = profile.Description,
            ContactEmail = profile.ContactEmail,
            Phone = profile.Phone,
            Address = profile.Address,
            Website = profile.Website,
            Industry = profile.Industry,
            LogoUrl = profile.LogoUrl,
            LinkedInUrl = profile.LinkedInUrl,
            TwitterUrl = profile.TwitterUrl,
            FacebookUrl = profile.FacebookUrl,
            BusinessHours = profile.BusinessHours,
            CompanySize = profile.CompanySize
        });
    }
}
