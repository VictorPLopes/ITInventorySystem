using ITInventorySystem.DTO.Products;
using ITInventorySystem.Models;
using ITInventorySystem.Repositories.Implementations;
using ITInventorySystem.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ITInventorySystem.Controllers
{
    public class ProductController : ControllerBase
    {
        private readonly IProductInterface _productInterface;

        public ProductController(IProductInterface productInterface)
        {
            _productInterface = productInterface;
        }

        [HttpGet("GetAllProducts")]
        public async Task<ActionResult<IEnumerable<Product>>> GetAllProducts()
        {
            var products = await _productInterface.GetAllAsync();
            return Ok(products);
        }

        [HttpGet("GetProduct/{id}")]
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            var product = await _productInterface.GetByIdAsync(id);
            return Ok(product);
        }

        [HttpPost("CreateProduct")]
        public async Task<ActionResult<Product>> CreateProduct(ProductCreateDTO prod)
        {
            var product = await _productInterface.AddAsync(prod);
            return Ok(product);
        }

        [HttpPut("UpdateProduct")]
        public async Task<ActionResult> UpdateProduct(ProductUpdateDTO prod)
        {
            try
            {
                await _productInterface.UpdateAsync(prod);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message); // Retorna 404 se o produto não foi encontrado
            }            
        }

        [HttpDelete("DeleteProduct/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                // Chama o método DeleteAsync do serviço
                await _productInterface.DeleteAsync(id);

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
                return StatusCode(500, new { message = "An error occurred while deleting the product", error = ex.Message });
            }
        }
    }

}

