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
            UserCount      = await context.Users.CountAsync(u => !u.IsDeleted),
            ProductCount   = await context.Products.CountAsync(p => !p.IsDeleted),
            ClientCount    = await context.Clients.CountAsync(c => !c.IsDeleted),
            WorkOrderCount = await context.WorkOrders.CountAsync()
        };

        return summary;
    }

    public async Task<IEnumerable<object>> GetTopProductsAsync()
    {
        var topProducts = await context.ProductsInWorkOrder
                                       .Where(p => !p.Product.IsDeleted)
                                       .GroupBy(p => p.ProductId)
                                       .Select(x => new
                                       {
                                           ProductId     = x.Key,
                                           ProductName   = x.First().Product.Name,
                                           TotalQuantity = x.Sum(p => p.Quantity)
                                       })
                                       .OrderByDescending(x => x.TotalQuantity)
                                       .Take(5)
                                       .ToListAsync();

        return topProducts;
    }
}