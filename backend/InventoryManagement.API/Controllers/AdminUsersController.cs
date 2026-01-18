using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.RateLimiting;
using InventoryManagement.Application.DTOs;
using InventoryManagement.Application.Interfaces;
using System.Security.Claims;
using InventoryManagement.Infrastructure.Data;

namespace InventoryManagement.API.Controllers;

[ApiController]
[Route("api/admin/users")]
[Authorize]
[EnableRateLimiting("admin")]
public class AdminUsersController : ControllerBase
{
    private readonly IAdminUserService _service;
    private readonly AppDbContext _context;

    public AdminUsersController(IAdminUserService service, AppDbContext context)
    {
        _service = service;
        _context = context;
    }

    private async Task<bool> IsAdmin()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                          ?? User.FindFirst("sub")?.Value;

        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out Guid userId))
            return false;

        var profile = await _context.Profiles.FindAsync(userId);
        return profile?.Role == "admin";
    }

    [HttpGet]
    public async Task<ActionResult<List<AdminUserDto>>> GetAllUsers()
    {
        if (!await IsAdmin()) return Forbid();

        var users = await _service.GetAllUsersAsync();
        return Ok(users);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<AdminUserDto>> GetUserById(Guid id)
    {
        if (!await IsAdmin()) return Forbid();

        var user = await _service.GetUserByIdAsync(id);
        if (user == null) return NotFound();
        return Ok(user);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<AdminUserDto>> UpdateUser(Guid id, [FromBody] UpdateUserDto dto)
    {
        if (!await IsAdmin()) return Forbid();

        var user = await _service.UpdateUserAsync(id, dto);
        if (user == null) return NotFound();
        return Ok(user);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteUser(Guid id)
    {
        if (!await IsAdmin()) return Forbid();

        var result = await _service.DeleteUserAsync(id);
        if (!result) return NotFound();
        return NoContent();
    }
}
