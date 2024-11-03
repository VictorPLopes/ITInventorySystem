using ITInventorySystem.Models;

namespace ITInventorySystem.Repositories.Interfaces
{
    public interface IProductInterface
    {
        Task<Product> GetByIdAsync(int id);
        Task<IEnumerable<Product>> GetAllAsync();
        Task AddAsync(Product product);
        Task UpdateAsync(Product product);
        Task DeleteAsync(int id);
    }
}
