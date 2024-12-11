using ITInventorySystem.DTO.User;
using ITInventorySystem.Models;
using ITInventorySystem.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ITInventorySystem.Controllers;

[Route("users")]
[ApiController]
public class UserController(IUserInterface userInterface) : ControllerBase
{
    //private readonly IUserInterface _userInterface;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<User>>> GetAllUsers() => Ok(await userInterface.GetAllAsync());

    [HttpGet("{id:int}")]
    public async Task<ActionResult<User>> GetUser(int id) => Ok(await userInterface.GetByIdAsync(id));

    /*[HttpGet("{email}")]
    public async Task<ActionResult<User>> GetUserByEmail(string email) =>
        Ok(await userInterface.GetByEmailAsync(email));*/

    [HttpPost]
    public async Task<ActionResult<User>> CreateUser([FromBody] UserCreateDto usr)
    {
        var user = await userInterface.AddAsync(usr);
        return Ok(user);
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult> UpdateUser(int id, [FromBody] UserUpdateDto user)
    {
        try
        {
            await userInterface.UpdateAsync(id, user);
            return Ok(user);
        }
        catch (KeyNotFoundException)
        {
            // Caso o usuário não seja encontrado, retorna um status 404 Not Found
            return NotFound(new { message = "User not found" });
        }
        catch (Exception ex)
        {
            // Para outros tipos de erro, retorna um status 500 Internal Server Error
            return StatusCode(500, new { message = "An error occurred while updating the user", error = ex.Message });
        }
    }

    [HttpPut("{id:int}/update-password")]
    public async Task<ActionResult> UpdateUserPassword(int id, [FromBody] UserUpdatePasswordDTO user)
    {
        try
        {
            await userInterface.UpdatePasswordAsync(id, user.NewPassword);
            return Ok(new { message = "User password updated successfully" });
        }
        catch (KeyNotFoundException)
        {
            // Caso o usuário não seja encontrado, retorna um status 404 Not Found
            return NotFound(new { message = "User not found" });
        }
        catch (Exception ex)
        {
            // Para outros tipos de erro, retorna um status 500 Internal Server Error
            return StatusCode(500, new { message = "An error occurred while updating the user", error = ex.Message });
        }
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            await userInterface.DeleteAsync(id);
            return Ok(new { message = "User deleted successfully" });
        }
        catch (KeyNotFoundException)
        {
            // Caso o usuário não seja encontrado, retorna um status 404 Not Found
            return NotFound(new { message = "User not found" });
        }
        catch (Exception ex)
        {
            // Para outros tipos de erro, retorna um status 500 Internal Server Error
            return StatusCode(500, new { message = "An error occurred while deleting the user", error = ex.Message });
        }
    }
}