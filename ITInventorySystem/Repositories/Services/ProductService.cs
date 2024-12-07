using ITInventorySystem.Data;
using ITInventorySystem.DTO.Products;
using ITInventorySystem.Models;
using ITInventorySystem.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ITInventorySystem.Repositories.Services;

public class ProductService(AppDbContext context) : IProductInterface
{
    public async Task<Product> AddAsync(ProductCreateDto product)
    {
        var prod = new Product
        {
            Name = product.Name,
            Description = product.Description,
            Quantity = product.Quantity,
            BrandManufacturerName = product.BrandManufacturerName,
            Category = product.Category,
            CostPrice = product.CostPrice,
            SalePrice = product.SalePrice
        };

        context.Products.Add(prod);
        await context.SaveChangesAsync();

        return prod;
    }

    public async Task DeleteAsync(int id)
    {
        try
        {
            var prod = await context.Products
                                    .FirstOrDefaultAsync(prodDb => prodDb.Id == id);

            if (prod == null) throw new KeyNotFoundException("Product not found!");

            context.Products.Remove(prod);
            await context.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException("An error occurred while deleting the product.", ex);
        }
    }

    public async Task<IEnumerable<Product>> GetAllAsync() => await context.Products.ToListAsync();


    public async Task<Product> GetByIdAsync(int id)
    {
        var product = await context.Products.FindAsync(id);
        if (product == null) throw new KeyNotFoundException("Product not found!");
        return product;
    }

    public async Task UpdateAsync(ProductUpdateDto product)
    {
        var prod = await context.Products
                                .FirstOrDefaultAsync(prodDb => prodDb.Id == product.Id);

        if (prod == null) throw new KeyNotFoundException("Product not found!");

        prod.Name = product.Name;
        prod.Description = product.Description;
        prod.Quantity = product.Quantity;
        prod.BrandManufacturerName = product.BrandManufacturerName;
        prod.Category = product.Category;
        prod.CostPrice = product.CostPrice;
        prod.SalePrice = product.SalePrice;
        prod.UpdatedAt = DateTime.Now;

        context.Products.Update(prod);
        await context.SaveChangesAsync();
    }
}