using ITInventorySystem.Data;
using ITInventorySystem.Models;
using ITInventorySystem.Models.Enums;
using ITInventorySystem.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ITInventorySystem.Repositories.Services;

public class StockMovementService(AppDbContext context) : IStockMovementInterface
{
    public async Task<StockMovement> RegisterMovementAsync(int productId, int quantity, EStockMovementType movementType, string description)
    {
        using var transaction = await context.Database.BeginTransactionAsync();
        try
        {
            //Verifica se o produto existe e n foi excluido 
            var product = await context.Products.FindAsync(productId);
            if (product == null || product.IsDeleted)
                throw new Exception($"Product {productId} not found or is deleted.");
            //Verifica se há estoque suficienmte para uma movimentação de Saída
            if (movementType == EStockMovementType.Exit && product.Quantity < quantity)
                throw new Exception($"Insufficient stock for Product {productId} .");

            //Atualiza o estoque
            product.Quantity += (movementType == EStockMovementType.Exit ? -quantity : quantity);
            context.Products.Update(product);

            //Registra a movimentacao
            var stockMov = new StockMovement
            {
                ProductId = productId,
                Quantity = quantity,
                MovementType = movementType,
                Description = description,
                CreatedAt = DateTime.Now
            };
            context.StockMovements.Add(stockMov);
            await context.SaveChangesAsync();
            await transaction.CommitAsync();

            return stockMov;
        }
        catch (Exception e)
        {
            await transaction.RollbackAsync();
            Console.WriteLine($"Error in RegisterMovementAsync: {e.Message}");
            throw;
        }
    }

    public async Task<IEnumerable<StockMovement>> GetAllMovementsAsync() => await context.StockMovements.Include(sm => sm.Product).ToListAsync();
    

    public async Task<IEnumerable<StockMovement>> GetByProductIdAsync(int productId)
    {
        var product = await context.Products.FindAsync(productId);
        
        if(product == null || product.IsDeleted)
            throw new Exception($"Product {productId} not found or is deleted.");
        
        return await context.StockMovements
            .Where(sm => sm.ProductId == productId)
            .Include(sm => sm.Product)
            .ToListAsync();
    }
}