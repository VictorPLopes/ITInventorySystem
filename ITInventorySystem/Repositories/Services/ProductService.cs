using ITInventorySystem.Models;
using ITInventorySystem.Repositories.Interfaces;

namespace ITInventorySystem.Repositories.Implementations;

public class ProductService : IProductInterface
{
    public Task AddAsync(Product product) => throw new NotImplementedException();

    public Task DeleteAsync(int id) => throw new NotImplementedException();

    public Task<IEnumerable<Product>> GetAllAsync() => throw new NotImplementedException();

    public Task<Product> GetByIdAsync(int id) => throw new NotImplementedException();

    public Task UpdateAsync(Product product) => throw new NotImplementedException();
}