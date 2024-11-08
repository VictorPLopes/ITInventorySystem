using ITInventorySystem.DTO.Client;
using ITInventorySystem.DTO.Product;
using ITInventorySystem.Models;
using ITInventorySystem.Repositories.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ITInventorySystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClientController : ControllerBase
    {
        private readonly IClientInterface _clientInterface;

        public ClientController(IClientInterface clientInterface)
        {
            _clientInterface = clientInterface;
        }

        [HttpGet("GetAllClients")]
        public async Task<ActionResult<IEnumerable<Client>>> GetAllClients()
        {
            var clients = await _clientInterface.GetAllAsync();
            return Ok(clients);
        }

        [HttpGet("GetClient/{id}")]
        public async Task<ActionResult<Client>> GetClient(int id)
        {
            var client = await _clientInterface.GetByIdAsync(id);
            return Ok(client);
        }

        [HttpPost("CreateClient")]
        public async Task<ActionResult<Client>> CreateClient(ClientCreateDTO clt)
        {
            var client = await _clientInterface.AddAsync(clt);
            return Ok(client);
        }

        [HttpPut("UpdateClient")]
        public async Task<ActionResult> UpdateClient(ClientUpdateDTO clt)
        {
            try
            {
                await _clientInterface.UpdateAsync(clt);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message); // Retorna 404 se o cliente não foi encontrado
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                // Chama o método DeleteAsync do serviço
                await _clientInterface.DeleteAsync(id);

                // Retorna uma resposta de sucesso (status 200 OK)
                return Ok(new { message = "Client deleted successfully" });
            }
            catch (KeyNotFoundException)
            {
                // Caso o cliente não seja encontrado, retorna um status 404 Not Found
                return NotFound(new { message = "Client not found" });
            }
            catch (Exception ex)
            {
                // Para outros tipos de erro, retorna um status 500 Internal Server Error
                return StatusCode(500, new { message = "An error occurred while deleting the client", error = ex.Message });
            }
        }
    }
}
