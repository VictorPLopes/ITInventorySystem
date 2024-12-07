using ITInventorySystem.DTO.Products;
using ITInventorySystem.Models;

namespace ITInventorySystem.Repositories.Interfaces;

public interface IProductInterface
{
    Task<Product> GetByIdAsync(int id);
    Task<IEnumerable<Product>> GetAllAsync();
    Task<Product> AddAsync(ProductCreateDto product);
    Task UpdateAsync(ProductUpdateDto product);
    Task DeleteAsync(int id);
}