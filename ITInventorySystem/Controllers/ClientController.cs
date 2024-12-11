using ITInventorySystem.DTO.Client;
using ITInventorySystem.Models;
using ITInventorySystem.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ITInventorySystem.Controllers;

[Route("clients")]
[ApiController]
public class ClientController(IClientInterface clientInterface) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Client>>> GetAllClients()
    {
        var clients = await clientInterface.GetAllAsync();
        return Ok(clients);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Client>> GetClient(int id)
    {
        var client = await clientInterface.GetByIdAsync(id);
        return Ok(client);
    }

    [HttpPost]
    public async Task<ActionResult<Client>> CreateClient([FromBody] ClientCreateDto clt)
    {
        var client = await clientInterface.AddAsync(clt);
        return Ok(client);
    }

    [HttpPut]
    public async Task<ActionResult> UpdateClient([FromBody] ClientUpdateDto clt)
    {
        try
        {
            await clientInterface.UpdateAsync(clt);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message); // Retorna 404 se o cliente não foi encontrado
        }
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            // Chama o método DeleteAsync do serviço
            await clientInterface.DeleteAsync(id);

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