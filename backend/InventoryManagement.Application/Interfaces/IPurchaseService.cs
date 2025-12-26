using InventoryManagement.Application.DTOs;

namespace InventoryManagement.Application.Interfaces;

public interface IPurchaseService
{
    Task<List<PurchaseDto>> GetAllAsync(Guid userId);
    Task<List<PurchaseDto>> GetActivePurchasesAsync(Guid userId);
    Task<PurchaseDto?> GetByIdAsync(Guid id, Guid userId);
    Task<PurchaseDto> CreateAsync(CreatePurchaseDto dto, Guid userId);
    Task<PurchaseDto?> CompleteAsync(Guid id, Guid userId);
    Task<bool> DeleteAsync(Guid id, Guid userId);
}
