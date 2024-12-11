using System.Text.Json;
using ITInventorySystem.DTO.WorkOrder;
using ITInventorySystem.Models;
using ITInventorySystem.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ITInventorySystem.Controllers;

[Route("work-orders")]
[ApiController]
public class WorkOrderController(IWorkOrderInterface workOrderInterface) : Controller
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<WorkOrder>>> GetAll()
    {
        var workOrders = await workOrderInterface.GetAllAsync();
        return Ok(workOrders);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<WorkOrder>> GetWorkOrder(int id)
    {
        var workOrder = await workOrderInterface.GetByIdAsync(id);
        return Ok(workOrder);
    }

    [HttpPost]
    public async Task<ActionResult<WorkOrder>> CreateWorkOrder([FromBody] WorkOrderCreateDto wo)
    {
        Console.WriteLine($"Received JSON: {JsonSerializer.Serialize(wo)}");
        var workOrder = await workOrderInterface.AddAsync(wo);
        return Ok(workOrder);
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult> UpdateWorkOrder(int id, [FromBody] WorkOrderUpdateDto wo)
    {
        try
        {
            await workOrderInterface.UpdateAsync(id, wo);
            return NoContent();
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpDelete("{id:int}")]
    public async Task<ActionResult> Delete(int id)
    {
        try
        {
            await workOrderInterface.DeleteAsync(id);
            return Ok(new { message = "Work Order deleted successfully" });
        }
        catch (KeyNotFoundException)
        {
            // Caso o produto não seja encontrado, retorna um status 404 Not Found
            return NotFound(new { message = "WorkOrder not found" });
        }
        catch (Exception ex)
        {
            // Para outros tipos de erro, retorna um status 500 Internal Server Error
            return StatusCode(500,
                              new { message = "An error occurred while deleting the work order", error = ex.Message });
        }
    }
}