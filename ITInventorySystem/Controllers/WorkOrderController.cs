using ITInventorySystem.DTO.Products;
using ITInventorySystem.DTO.WorkOrder;
using ITInventorySystem.Models;
using ITInventorySystem.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace ITInventorySystem.Controllers
{
    public class WorkOrderController : Controller
    {
        private readonly IWorkOrderInterface _workOrderInterface;

        public WorkOrderController(IWorkOrderInterface workOrderInterface)
        {
            _workOrderInterface = workOrderInterface;
        }

        [HttpGet("GetAll")]
        public async Task<ActionResult<IEnumerable<WorkOrder>>> GetAll()
        {
            var workOrders = await _workOrderInterface.GetAllAsync();
            return Ok(workOrders);
        }

        [HttpGet("GetWorkOrder/{id}")]
        public async Task<ActionResult<WorkOrder>> GetWorkOrder(int id)
        {
            var workOrder = await _workOrderInterface.GetByIdAsync(id);
            return Ok(workOrder);
        }

        [HttpPost("CreateWorkOrder")]
        public async Task<ActionResult<WorkOrder>> CreateWorkOrder([FromBody] WorkOrderCreateDTO wo)
        {
            Console.WriteLine($"Received JSON: {JsonSerializer.Serialize(wo)}");
            var workOrder = await _workOrderInterface.AddAsync(wo);
            return Ok(workOrder);
        }

        [HttpPut("UpdateWorkOrder")]
        public async Task<ActionResult> UpdateWorkOrder([FromBody] WorkOrderUpdateDTO wo)
        {
            try
            {
                await _workOrderInterface.UpdateAsync(wo);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("DeleteWorkOrder/{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            try
            {
                await _workOrderInterface.DeleteAsync(id);
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
                return StatusCode(500, new { message = "An error occurred while deleting the work order", error = ex.Message });
            }
        }

    }
}
