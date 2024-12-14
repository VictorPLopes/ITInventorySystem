using ITInventorySystem.Data;
using ITInventorySystem.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ITInventorySystem.Repositories.Services;

public class DashboardService(AppDbContext context) : IDashboardService
{
    public async Task<object> GetSummaryAsync()
    {
        var summary = new
        {
            UserCount = await context.Users.CountAsync(),
            ProductCount = await context.Products.CountAsync(),
            ClientCount = await context.Clients.CountAsync(),
            WorkOrderCount = await context.WorkOrders.CountAsync()
        };

        return summary;
    }

    public async Task<IEnumerable<object>> GetTopProductsAsync()
    {
        var topProducts = await context.ProductsInWorkOrder
            .GroupBy(p => p.ProductId)
            .Select(x => new
            {
                ProductId = x.Key,
                ProductName = x.First().Product.Name,
                TotalQuantity = x.Sum(p => p.ProductQuantity)
            })
            .OrderByDescending(x => x.TotalQuantity)
            .Take(5)
            .ToListAsync();

        return topProducts;
    }
}