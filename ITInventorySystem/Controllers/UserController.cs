using System.Security.Claims;
using ITInventorySystem.DTO.User;
using ITInventorySystem.Models;
using ITInventorySystem.Models.Enums;
using ITInventorySystem.Repositories.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ITInventorySystem.Controllers;

[Route("users")]
[ApiController]
[Authorize(Roles = "Admin, Master")]
public class UserController(IUserInterface userInterface) : ControllerBase
{
    private int GetCurrentUserId() =>
        int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

    private string? GetCurrentUserRole() =>
        User.FindFirst(ClaimTypes.Role)?.Value;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<User>>> GetAllUsers() => Ok(await userInterface.GetAllAsync());

    [HttpGet("{id:int}")]
    public async Task<ActionResult<User>> GetUser(int id) => Ok(await userInterface.GetByIdAsync(id));

    [HttpPost]
    public async Task<ActionResult<User>> CreateUser([FromBody] UserCreateDto usr)
    {
        var currentUserRole = GetCurrentUserRole();

        // Admins não podem criar Admins ou Masters
        if (currentUserRole == "Admin" && usr.Type <= (EPrivilegeType)1) // 1: Admin, 0: Master
            return Forbid("Admins não podem criar Admins ou Masters.");

        var user = await userInterface.AddAsync(usr);
        return Ok(user);
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult> UpdateUser(int id, [FromBody] UserUpdateDto user)
    {
        var currentUserId   = GetCurrentUserId();
        var currentUserRole = GetCurrentUserRole();

        switch (currentUserRole)
        {
            // Previne Admins de editarem a si mesmos
            case "Admin" when id == currentUserId:
                return Forbid("Admins não podem editar a si mesmos.");
            // Previne Admins de editarem Admins ou Masters
            case "Admin":
            {
                var targetUser = await userInterface.GetByIdAsync(id);
                if (targetUser.Type <= (EPrivilegeType)1 || user.Type <= (EPrivilegeType)1) // 1: Admin, 0: Master
                    return Forbid("Admins não podem editar Admins ou Masters.");
                break;
            }
        }

        try
        {
            await userInterface.UpdateAsync(id, user);
            return Ok(user);
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { message = "User not found" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "An error occurred", error = ex.Message });
        }
    }

    [HttpPut("{id:int}/update-password")]
    public async Task<ActionResult> UpdateUserPassword(int id, [FromBody] UserUpdatePasswordDTO user)
    {
        var currentUserId   = GetCurrentUserId();
        var currentUserRole = GetCurrentUserRole();

        // Previne Admins de editarem a senha de Admins ou Masters
        if (currentUserRole == "Admin")
        {
            var targetUser = await userInterface.GetByIdAsync(id);
            if (targetUser.Type <= (EPrivilegeType)1 && targetUser.Id != currentUserId) // 1: Admin, 0: Master
                return Forbid("Admins não podem editar Admins ou Masters.");
        }

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
        var currentUserId   = GetCurrentUserId();
        var currentUserRole = GetCurrentUserRole();

        // Ninguém, nem mesmo o root, pode deletar a si mesmo
        if (id == currentUserId)
            return Forbid("Você não pode deletar a si mesmo.");
        // Admins não podem deletar Admins ou Masters
        if (currentUserRole == "Admin")
        {
            var targetUser = await userInterface.GetByIdAsync(id);
            if (targetUser.Type <= (EPrivilegeType)1) // 1: Admin, 0: Master
                return Forbid("Admins não podem deletar Admins ou Masters.");
        }

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