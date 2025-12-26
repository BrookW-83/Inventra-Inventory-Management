using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using InventoryManagement.Application.DTOs;
using InventoryManagement.Application.Interfaces;
using System.Security.Claims;

namespace InventoryManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PurchasesController : ControllerBase
{
    private readonly IPurchaseService _service;

    public PurchasesController(IPurchaseService service)
    {
        _service = service;
    }

    private Guid GetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out Guid userId))
        {
            throw new UnauthorizedAccessException("Invalid user ID");
        }
        return userId;
    }

    [HttpGet]
    public async Task<ActionResult<List<PurchaseDto>>> GetAll()
    {
        var userId = GetUserId();
        var purchases = await _service.GetAllAsync(userId);
        return Ok(purchases);
    }

    [HttpGet("active")]
    public async Task<ActionResult<List<PurchaseDto>>> GetActive()
    {
        var userId = GetUserId();
        var purchases = await _service.GetActivePurchasesAsync(userId);
        return Ok(purchases);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<PurchaseDto>> GetById(Guid id)
    {
        var userId = GetUserId();
        var purchase = await _service.GetByIdAsync(id, userId);
        if (purchase == null) return NotFound();
        return Ok(purchase);
    }

    [HttpPost]
    public async Task<ActionResult<PurchaseDto>> Create(CreatePurchaseDto dto)
    {
        var userId = GetUserId();
        var purchase = await _service.CreateAsync(dto, userId);
        return CreatedAtAction(nameof(GetById), new { id = purchase.Id }, purchase);
    }

    [HttpPost("{id:guid}/complete")]
    public async Task<ActionResult<PurchaseDto>> Complete(Guid id)
    {
        var userId = GetUserId();
        var result = await _service.CompleteAsync(id, userId);
        if (result == null) return NotFound();
        return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(Guid id)
    {
        var userId = GetUserId();
        var result = await _service.DeleteAsync(id, userId);
        if (!result) return NotFound();
        return NoContent();
    }
}
