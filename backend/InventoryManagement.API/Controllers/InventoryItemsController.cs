using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using InventoryManagement.Application.DTOs;
using InventoryManagement.Application.Interfaces;
using System.Security.Claims;

namespace InventoryManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class InventoryItemsController : ControllerBase
{
    private readonly IInventoryItemService _service;

    public InventoryItemsController(IInventoryItemService service)
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
    public async Task<ActionResult<List<InventoryItemDto>>> GetAll()
    {
        var userId = GetUserId();
        var items = await _service.GetAllAsync(userId);
        return Ok(items);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<InventoryItemDto>> GetById(Guid id)
    {
        var userId = GetUserId();
        var item = await _service.GetByIdAsync(id, userId);
        if (item == null) return NotFound();
        return Ok(item);
    }

    [HttpPost]
    public async Task<ActionResult<InventoryItemDto>> Create(CreateInventoryItemDto dto)
    {
        var userId = GetUserId();
        var item = await _service.CreateAsync(dto, userId);
        return CreatedAtAction(nameof(GetById), new { id = item.Id }, item);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<InventoryItemDto>> Update(Guid id, UpdateInventoryItemDto dto)
    {
        var userId = GetUserId();
        var item = await _service.UpdateAsync(id, dto, userId);
        if (item == null) return NotFound();
        return Ok(item);
    }

    [HttpPost("{id:guid}/remove")]
    public async Task<ActionResult<InventoryItemDto>> RemoveStock(Guid id, InventoryAdjustmentRequest request)
    {
        var userId = GetUserId();
        var item = await _service.RemoveStockAsync(id, request, userId);
        if (item == null) return NotFound();
        return Ok(item);
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
