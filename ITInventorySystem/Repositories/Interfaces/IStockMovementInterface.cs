using ITInventorySystem.Models;
using ITInventorySystem.Models.Enums;

namespace ITInventorySystem.Repositories.Interfaces;

public interface IStockMovementInterface
{
    Task<StockMovement> RegisterMovementAsync(int    productId, int quantity, EStockMovementType movementType,
                                              string description);

    Task<IEnumerable<StockMovement>> GetAllMovementsAsync();
    Task<IEnumerable<StockMovement>> GetByProductIdAsync(int productId);
}