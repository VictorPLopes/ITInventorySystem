using ITInventorySystem.DTO.Products;
using ITInventorySystem.Models;

namespace ITInventorySystem.Repositories.Interfaces;

public interface IProductInterface
{

    Task<Product> GetByIdAsync(int id);
    Task<IEnumerable<Product>> GetAllAsync();
    Task<Product> AddAsync(ProductCreateDTO product);
    Task UpdateAsync(ProductUpdateDTO product);
    Task DeleteAsync(int id);
}