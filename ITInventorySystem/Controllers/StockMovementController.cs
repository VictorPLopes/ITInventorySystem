using ITInventorySystem.DTO.StockMovement;
using ITInventorySystem.Exceptions;
using ITInventorySystem.Repositories.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ITInventorySystem.Controllers;

[ApiController]
[Route("movements")]
[Authorize]
public class StockMovementController(IStockMovementInterface stockMovementService) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> RegisterMovement([FromBody] CreateStockMovementDTO movementDTO)
    {
        try
        {
            var stockMovement = await stockMovementService.RegisterMovementAsync(
                                     movementDTO.ProductId,
                                     movementDTO.Quantity,
                                     movementDTO.MovementType,
                                     movementDTO.Description
                                    );

            return CreatedAtAction(nameof(GetMovementById), new { id = stockMovement.Id }, stockMovement);
        }
        catch (StockMovementException ex)
        {
            return BadRequest(new { message = ex.Message, code = ex.ErrorCode });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Erro inesperado no servidor.", code = 1099 });
        }
    }

    [HttpGet]
    public async Task<IActionResult> GetAllMovements()
    {
        var movements = await stockMovementService.GetAllMovementsAsync();
        return Ok(movements);
    }

    // GET: api/StockMovement/Product/{productId}
    [HttpGet("product/{productId}")]
    public async Task<IActionResult> GetMovementsByProductId(int productId)
    {
        try
        {
            var movements = await stockMovementService.GetByProductIdAsync(productId);
            return Ok(movements);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // GET: api/StockMovement/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> GetMovementById(int id)
    {
        try
        {
            var movement = (await stockMovementService.GetAllMovementsAsync())
                .FirstOrDefault(sm => sm.Id == id);

            if (movement == null) return NotFound(new { message = $"Stock movement with ID {id} not found." });

            return Ok(movement);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}