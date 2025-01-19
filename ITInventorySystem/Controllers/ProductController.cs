using ITInventorySystem.DTO.Products;
using ITInventorySystem.Models;
using ITInventorySystem.Repositories.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ITInventorySystem.Controllers;

[Route("products")]
[ApiController]
[Authorize]
public class ProductController(IProductInterface productInterface) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Product>>> GetAllProducts()
    {
        var products = await productInterface.GetAllAsync();
        return Ok(products);
    }

    [HttpGet("all")]
    public async Task<ActionResult<IEnumerable<Product>>> GetAllProductsIncludingDeleted()
    {
        var products = await productInterface.GetAllAsync(true); // Inclui deletados
        return Ok(products);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Product>> GetProduct(int id)
    {
        try
        {
            var product = await productInterface.GetByIdAsync(id);
            return Ok(product);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message); // Retorna 404 se o produto não for encontrado
        }
    }

    [HttpPost]
    public async Task<ActionResult<Product>> CreateProduct([FromBody] ProductCreateDto prod)
    {
        if (!ModelState.IsValid) // Validações básicas no DTO
            return BadRequest(ModelState);

        try
        {
            var product = await productInterface.AddAsync(prod);
            return CreatedAtAction(nameof(GetProduct), new { id = product.Id },
                                   product); // Retorna 201 Created com localização
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message }); // Validações específicas (ex: valores negativos)
        }
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult> UpdateProduct(int id, [FromBody] ProductUpdateDto prod)
    {
        if (!ModelState.IsValid) // Validações básicas no DTO
            return BadRequest(ModelState);

        try
        {
            await productInterface.UpdateAsync(id, prod);
            return NoContent(); // Retorna 204 No Content em caso de sucesso
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message }); // Retorna 404 se o produto não for encontrado
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message }); // Validações específicas
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