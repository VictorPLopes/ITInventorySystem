using ITInventorySystem.DTO.Products;
using ITInventorySystem.Models;

namespace ITInventorySystem.Repositories.Interfaces;

public interface IProductInterface
{
    Task<Product>              GetByIdAsync(int          id);
    Task<IEnumerable<Product>> GetAllAsync(bool          includeDeleted = false);
    Task<Product>              AddAsync(ProductCreateDto product);
    Task                       UpdateAsync(int           id, ProductUpdateDto product);
    Task                       DeleteAsync(int           id);
}