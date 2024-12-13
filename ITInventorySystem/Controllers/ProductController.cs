using ITInventorySystem.DTO.Products;
using ITInventorySystem.Models;
using ITInventorySystem.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ITInventorySystem.Controllers;

[Route("products")]
[ApiController]
public class ProductController(IProductInterface productInterface) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Product>>> GetAllProducts()
    {
        var products = await productInterface.GetAllAsync();
        return Ok(products);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Product>> GetProduct(int id)
    {
        var product = await productInterface.GetByIdAsync(id);
        return Ok(product);
    }

    [HttpPost]
    public async Task<ActionResult<Product>> CreateProduct([FromBody] ProductCreateDto prod)
    {
        var product = await productInterface.AddAsync(prod);
        return Ok(product);
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult> UpdateProduct(int id, [FromBody] ProductUpdateDto prod)
    {
        try
        {
            await productInterface.UpdateAsync(id, prod);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message); // Retorna 404 se o produto não foi encontrado
        }
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            // Chama o método DeleteAsync do serviço
            await productInterface.DeleteAsync(id);

            // Retorna uma resposta de sucesso (status 200 OK)
            return Ok(new { message = "Product deleted successfully" });
        }
        catch (KeyNotFoundException)
        {
            // Caso o produto não seja encontrado, retorna um status 404 Not Found
            return NotFound(new { message = "Product not found" });
        }
        catch (Exception ex)
        {
            // Para outros tipos de erro, retorna um status 500 Internal Server Error
            return StatusCode(500,
                              new { message = "An error occurred while deleting the product", error = ex.Message });
        }
    }
}