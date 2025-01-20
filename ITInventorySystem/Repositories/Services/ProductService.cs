using ITInventorySystem.Data;
using ITInventorySystem.DTO.Products;
using ITInventorySystem.Models;
using ITInventorySystem.Models.Enums;
using ITInventorySystem.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ITInventorySystem.Repositories.Services;

public class ProductService(AppDbContext context) : IProductInterface
{
    public async Task<Product> AddAsync(ProductCreateDto product)
    {
        ValidateProductData(product.Quantity, product.CostPrice, product.SalePrice);

        await using var transaction = await context.Database.BeginTransactionAsync();
        try
        {
            var prod = new Product
            {
                Name                  = product.Name,
                Description           = product.Description,
                Quantity              = product.Quantity,
                BrandManufacturerName = product.BrandManufacturerName,
                Category              = product.Category,
                CostPrice             = product.CostPrice,
                SalePrice             = product.SalePrice
            };

            context.Products.Add(prod);
            await context.SaveChangesAsync();

            // Cria movimentação de estoque
            var movement = new StockMovement
            {
                ProductId    = prod.Id,
                Description  = "Initial stock entry",
                Quantity     = product.Quantity,
                MovementType = EStockMovementType.Entry,
                CreatedAt    = DateTime.Now
            };

            context.StockMovements.Add(movement);
            await context.SaveChangesAsync();

            await transaction.CommitAsync();
            return prod;
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }
    public async Task DeleteAsync(int id)
    {
        try
        {
            var prod = await context.Products
                                    .FirstOrDefaultAsync(prodDb => prodDb.Id == id);

            if (prod == null) throw new KeyNotFoundException("Product not found!");

            prod.IsDeleted = true;
            await context.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException("An error occurred while deleting the product.", ex);
        }
    }

    public async Task<IEnumerable<Product>> GetAllAsync(bool includeDeleted = false)
    {
        if (includeDeleted) return await context.Products.ToListAsync();

        return await context.Products.Where(p => !p.IsDeleted).ToListAsync();
    }


    public async Task<Product> GetByIdAsync(int id)
    {
        var product = await context.Products.FindAsync(id);
        if (product == null) throw new KeyNotFoundException("Product not found!");
        return product;
    }

    public async Task UpdateAsync(int id, ProductUpdateDto product)
    {
        var prod = await context.Products
                                .FirstOrDefaultAsync(prodDb => prodDb.Id == id && !prodDb.IsDeleted);

        if (prod == null) throw new KeyNotFoundException("Product not found!");

        prod.Name                  = product.Name;
        prod.Description           = product.Description;
        prod.BrandManufacturerName = product.BrandManufacturerName;
        prod.Category              = product.Category;
        prod.CostPrice             = product.CostPrice;
        prod.SalePrice             = product.SalePrice;
        prod.UpdatedAt             = DateTime.Now;

        context.Products.Update(prod);
        await context.SaveChangesAsync();
    }

    private void ValidateProductData(int quantity, decimal costPrice, decimal salePrice)
    {
        if (quantity < 0)
            throw new ArgumentException("Quantity cannot be negative.");

        if (costPrice < 0)
            throw new ArgumentException("Cost price cannot be negative.");

        if (salePrice < 0)
            throw new ArgumentException("Sale price cannot be negative.");
    }
}