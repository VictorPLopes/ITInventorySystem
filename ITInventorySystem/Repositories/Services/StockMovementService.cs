using ITInventorySystem.Data;
using ITInventorySystem.Exceptions;
using ITInventorySystem.Models;
using ITInventorySystem.Models.Enums;
using ITInventorySystem.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ITInventorySystem.Repositories.Services;

public class StockMovementService(AppDbContext context) : IStockMovementInterface
{
    public async Task<StockMovement> RegisterMovementAsync(int productId, int quantity, EStockMovementType movementType,
                                                           string description)
    {
        await using var transaction = await context.Database.BeginTransactionAsync();
        try
        {
            var product = await context.Products.FindAsync(productId);
            if (product == null || product.IsDeleted)
                throw new StockMovementException($"Produto {productId} não encontrado ou desativado.", 1001);

            switch (movementType)
            {
                case EStockMovementType.Entry:
                    if (quantity <= 0)
                        throw new StockMovementException("A quantidade para entrada deve ser positiva.", 1002);
                    product.Quantity += quantity;
                    break;

                case EStockMovementType.Exit:
                    if (quantity <= 0)
                        throw new StockMovementException("A quantidade para saída deve ser positiva.", 1003);
                    if (product.Quantity < quantity)
                        throw new
                            StockMovementException($"Estoque insuficiente! Disponível: {product.Quantity}, solicitado: {quantity}.",
                                                   1004);
                    product.Quantity -= quantity;
                    break;

                case EStockMovementType.Adjustment:
                    if (product.Quantity + quantity < 0)
                        throw new
                            StockMovementException($"Ajuste de estoque inválido! Estoque não pode ser negativo. Disponível: {product.Quantity}, ajuste: {quantity}.",
                                                   1005);
                    product.Quantity += quantity;
                    break;

                default:
                    throw new StockMovementException("Tipo de movimentação inválido.", 1006);
            }

            context.Products.Update(product);

            var stockMov = new StockMovement
            {
                ProductId    = productId,
                Quantity     = quantity,
                MovementType = movementType,
                Description  = description,
                CreatedAt    = DateTime.Now
            };
            context.StockMovements.Add(stockMov);
            await context.SaveChangesAsync();
            await transaction.CommitAsync();

            return stockMov;
        }
        catch (StockMovementException ex) // Captura erros específicos de estoque
        {
            await transaction.RollbackAsync();
            Console.WriteLine($"Erro específico no estoque: {ex.Message}");
            throw;
        }
        catch (Exception ex) // Captura outros erros inesperados
        {
            await transaction.RollbackAsync();
            Console.WriteLine($"Erro inesperado: {ex.Message}");
            throw new StockMovementException("Erro interno no servidor ao registrar movimentação.", 1099);
        }
    }

    public async Task<IEnumerable<StockMovement>> GetAllMovementsAsync() =>
        await context.StockMovements.Include(sm => sm.Product).ToListAsync();


    public async Task<IEnumerable<StockMovement>> GetByProductIdAsync(int productId)
    {
        var product = await context.Products.FindAsync(productId);

        if (product == null || product.IsDeleted)
            throw new Exception($"Product {productId} not found or is deleted.");

        return await context.StockMovements
                            .Where(sm => sm.ProductId == productId)
                            .Include(sm => sm.Product)
                            .ToListAsync();
    }
}