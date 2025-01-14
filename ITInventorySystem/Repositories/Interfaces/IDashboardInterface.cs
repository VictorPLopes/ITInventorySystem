namespace ITInventorySystem.Repositories.Interfaces;

public interface IDashboardService
{
    Task<object> GetSummaryAsync();
    Task<IEnumerable<object>> GetTopProductsAsync();
}