using InventoryManagement.Application.DTOs;

namespace InventoryManagement.Application.Interfaces;

public interface IInventoryItemService
{
    Task<List<InventoryItemDto>> GetAllAsync(Guid userId);
    Task<InventoryItemDto?> GetByIdAsync(Guid id, Guid userId);
    Task<InventoryItemDto> CreateAsync(CreateInventoryItemDto dto, Guid userId);
    Task<InventoryItemDto?> UpdateAsync(Guid id, UpdateInventoryItemDto dto, Guid userId);
    Task<bool> DeleteAsync(Guid id, Guid userId);
    Task<InventoryItemDto?> RemoveStockAsync(Guid id, InventoryAdjustmentRequest request, Guid userId);
}
