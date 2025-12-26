using InventoryManagement.Application.DTOs;

namespace InventoryManagement.Application.Interfaces;

public interface IDashboardService
{
    Task<DashboardStatsDto> GetDashboardStatsAsync(Guid userId);
}
