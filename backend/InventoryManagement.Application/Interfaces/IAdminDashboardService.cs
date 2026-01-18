using InventoryManagement.Application.DTOs;

namespace InventoryManagement.Application.Interfaces;

public interface IAdminDashboardService
{
    Task<AdminDashboardStatsDto> GetAdminDashboardStatsAsync();
}
