using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.RateLimiting;
using InventoryManagement.Application.DTOs;
using InventoryManagement.Application.Interfaces;
using System.Security.Claims;
using InventoryManagement.Infrastructure.Data;

namespace InventoryManagement.API.Controllers;

[ApiController]
[Route("api/admin/dashboard")]
[Authorize]
[EnableRateLimiting("dashboard")]
public class AdminDashboardController : ControllerBase
{
    private readonly IAdminDashboardService _service;
    private readonly AppDbContext _context;

    public AdminDashboardController(IAdminDashboardService service, AppDbContext context)
    {
        _service = service;
        _context = context;
    }

    [HttpGet("stats")]
    public async Task<ActionResult<AdminDashboardStatsDto>> GetStats()
    {
        // Verify admin role
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                          ?? User.FindFirst("sub")?.Value;

        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out Guid userId))
        {
            return Unauthorized();
        }

        var profile = await _context.Profiles.FindAsync(userId);
        if (profile == null || profile.Role != "admin")
        {
            return Forbid();
        }

        var stats = await _service.GetAdminDashboardStatsAsync();
        return Ok(stats);
    }
}
