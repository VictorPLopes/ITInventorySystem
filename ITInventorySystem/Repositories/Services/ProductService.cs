using ITInventorySystem.Data;
using ITInventorySystem.DTO.Product;
using ITInventorySystem.Models;
using ITInventorySystem.Repositories.Interfaces;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace ITInventorySystem.Repositories.Implementations;

public class ProductService : IProductInterface
{
    private readonly AppDbContext _context;

    public ProductService(AppDbContext context)
    {
        _context = context;
    }  

    public async Task<Product> AddAsync(ProductCreateDTO product)
    {       
        var prod = new Product()
        {
            Name = product.Name,
            Description = product.Description,
            Quantity = product.Quantity,
            BrandManufacturerName = product.BrandManufacturerName,
            Category = product.Category,
            CostPrice = product.CostPrice,
            SalePrice = product.SalePrice
        };

        _context.Products.Add(prod);
        await _context.SaveChangesAsync();

        return prod;
    }

    public async Task DeleteAsync(int id) 
    {
        try
        {
            var prod = await _context.Products
                .FirstOrDefaultAsync(prodDB => prodDB.Id == id);

            if (prod == null)
            {
                throw new KeyNotFoundException("Product not found!");
            }

            _context.Products.Remove(prod);
            await _context.SaveChangesAsync();
        }
        catch (Exception ex)
        {

            throw new InvalidOperationException("An error occurred while deleting the product.", ex);
        }
    }

    public async Task<IEnumerable<Product>> GetAllAsync() 
    {
        return await _context.Products.ToListAsync();
    }


    public async Task<Product> GetByIdAsync(int id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null)
        {
            throw new KeyNotFoundException("Product not found!");
        }
        return product;
    } 
    
    public async Task UpdateAsync(ProductUpdateDTO product)
    {
        var prod = await _context.Products
               .FirstOrDefaultAsync(prodDB => prodDB.Id == product.Id);

        if (prod == null)
        {
            throw new KeyNotFoundException("Product not found!");
        }

        prod.Name = product.Name;
        prod.Description = product.Description;
        prod.Quantity = product.Quantity;
        prod.BrandManufacturerName = product.BrandManufacturerName;
        prod.Category = product.Category;
        prod.CostPrice = product.CostPrice;
        prod.SalePrice = product.SalePrice;
        prod.UpdatedAt = DateTime.Now;

        await _context.SaveChangesAsync();
    }
}