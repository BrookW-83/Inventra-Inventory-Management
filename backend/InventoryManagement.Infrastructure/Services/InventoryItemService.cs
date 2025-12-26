using InventoryManagement.Application.DTOs;
using InventoryManagement.Application.Interfaces;
using InventoryManagement.Domain.Entities;

namespace InventoryManagement.Infrastructure.Services;

public class InventoryItemService : IInventoryItemService
{
    private readonly IRepository<InventoryItem> _repository;
    private readonly IRepository<InventoryLog> _logRepository;

    public InventoryItemService(IRepository<InventoryItem> repository, IRepository<InventoryLog> logRepository)
    {
        _repository = repository;
        _logRepository = logRepository;
    }

    public async Task<List<InventoryItemDto>> GetAllAsync(Guid userId)
    {
        var items = await _repository.GetAllAsync();
        return items.Where(i => i.UserId == userId).Select(MapToDto).ToList();
    }

    public async Task<InventoryItemDto?> GetByIdAsync(Guid id, Guid userId)
    {
        var item = await _repository.GetByIdAsync(id);
        if (item == null || item.UserId != userId) return null;
        return MapToDto(item);
    }

    public async Task<InventoryItemDto> CreateAsync(CreateInventoryItemDto dto, Guid userId)
    {
        var item = new InventoryItem
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Name = dto.Name,
            Description = dto.Description,
            Quantity = dto.Quantity,
            UnitPrice = dto.UnitPrice,
            Section = dto.Section,
            ImageUrl = dto.ImageUrl,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await _repository.AddAsync(item);
        await _repository.SaveChangesAsync();

        return MapToDto(item);
    }

    public async Task<InventoryItemDto?> UpdateAsync(Guid id, UpdateInventoryItemDto dto, Guid userId)
    {
        var item = await _repository.GetByIdAsync(id);
        if (item == null || item.UserId != userId) return null;

        item.Name = dto.Name;
        item.Description = dto.Description;
        item.Quantity = dto.Quantity;
        item.UnitPrice = dto.UnitPrice;
        item.Section = dto.Section;
        item.ImageUrl = dto.ImageUrl;
        item.UpdatedAt = DateTime.UtcNow;

        await _repository.UpdateAsync(item);
        await _repository.SaveChangesAsync();

        return MapToDto(item);
    }

    public async Task<bool> DeleteAsync(Guid id, Guid userId)
    {
        var item = await _repository.GetByIdAsync(id);
        if (item == null || item.UserId != userId) return false;

        await _repository.DeleteAsync(item);
        await _repository.SaveChangesAsync();

        return true;
    }

    public async Task<InventoryItemDto?> RemoveStockAsync(Guid id, InventoryAdjustmentRequest request, Guid userId)
    {
        if (request.Quantity <= 0)
        {
            throw new ArgumentException("Quantity must be greater than zero", nameof(request.Quantity));
        }

        var item = await _repository.GetByIdAsync(id);
        if (item == null || item.UserId != userId) return null;

        if (item.Quantity < request.Quantity)
        {
            throw new InvalidOperationException("Cannot remove more than available inventory.");
        }

        item.Quantity -= request.Quantity;
        item.UpdatedAt = DateTime.UtcNow;

        await _repository.UpdateAsync(item);

        await _logRepository.AddAsync(new InventoryLog
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            InventoryItemId = item.Id,
            Action = string.IsNullOrWhiteSpace(request.Reason) ? "Inventory removal" : request.Reason,
            QuantityChanged = -request.Quantity,
            PerformedBy = string.IsNullOrWhiteSpace(request.PerformedBy) ? "System" : request.PerformedBy,
            CreatedAt = DateTime.UtcNow
        });

        await _repository.SaveChangesAsync();

        return MapToDto(item);
    }

    private static InventoryItemDto MapToDto(InventoryItem item)
    {
        return new InventoryItemDto
        {
            Id = item.Id,
            Name = item.Name,
            Description = item.Description,
            Quantity = item.Quantity,
            UnitPrice = item.UnitPrice,
            Section = item.Section,
            ImageUrl = item.ImageUrl,
            CreatedAt = item.CreatedAt,
            UpdatedAt = item.UpdatedAt
        };
    }
}
