using InventoryManagement.Application.DTOs;

namespace InventoryManagement.Application.Interfaces;

public interface IAdminUserService
{
    Task<List<AdminUserDto>> GetAllUsersAsync();
    Task<AdminUserDto?> GetUserByIdAsync(Guid userId);
    Task<AdminUserDto?> UpdateUserAsync(Guid userId, UpdateUserDto dto);
    Task<bool> DeleteUserAsync(Guid userId);
}
