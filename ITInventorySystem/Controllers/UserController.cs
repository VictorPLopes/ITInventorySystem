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
[Authorize(Roles = "Admin, Master, Standard")]
public class UserController(IUserInterface userInterface) : ControllerBase
{
    private int GetCurrentUserId() =>
        int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

    private string? GetCurrentUserRole() =>
        User.FindFirst(ClaimTypes.Role)?.Value;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<User>>> GetAllUsers() => Ok(await userInterface.GetAllAsync());

    [HttpGet("all")]
    public async Task<ActionResult<IEnumerable<User>>> GetAllUsersIncludingDeleted() =>
        Ok(await userInterface.GetAllAsync(true));

    [HttpGet("count")]
    [AllowAnonymous]
    public async Task<ActionResult<int>> GetUsersCount() => Ok(await userInterface.GetCountAsync());

    [HttpGet("{id:int}")]
    public async Task<ActionResult<User>> GetUser(int id) => Ok(await userInterface.GetByIdAsync(id));

    [HttpPost("setup")]
    [AllowAnonymous]
    public async Task<ActionResult<User>> SetupFirstAdmin([FromBody] UserCreateDto userDto)
    {
        var existingAdmin = await userInterface.GetAllAsync();
        if (existingAdmin.Any(u => u.Type == EPrivilegeType.Admin || u.Type == EPrivilegeType.Master))
            return Forbid("O sistema já foi configurado.");

        var user = await userInterface.AddAsync(userDto);
        return Ok(user);
    }

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
            return NotFound(new { message = "Usuário não encontrado" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Um erro ocorreu ao editar o usuário", error = ex.Message });
        }
    }

    [HttpPost("{id:int}/update-password")]
    public async Task<ActionResult> UpdateUserPassword(int id, [FromBody] UserUpdatePasswordDto user)
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
            return Ok(new { message = "Senha do usuário atualizada com sucesso" });
        }
        catch (KeyNotFoundException)
        {
            // Caso o usuário não seja encontrado, retorna um status 404 Not Found
            return NotFound(new { message = "Usuário não encontrado" });
        }
        catch (Exception ex)
        {
            // Para outros tipos de erro, retorna um status 500 Internal Server Error
            return StatusCode(500,
                              new { message = "Um erro ocorreu ao editar a senha do usuário", error = ex.Message });
        }
    }

    [HttpPost("{id:int}/update-my-password")]
    [Authorize(Roles = "Standard, Admin, Master")]
    public async Task<ActionResult> UpdateMyPassword(int id, [FromBody] UserUpdateMyPasswordDto user)
    {
        var currentUserId = GetCurrentUserId();

        // Usuários comuns não podem editar a senha de outros usuários
        if (currentUserId != id)
            return Forbid("Você não tem permissão para editar a senha de outro usuário.");

        try
        {
            await userInterface.UpdateMyPasswordAsync(id, user.OldPassword, user.NewPassword);
            return Ok(new { message = "Senha do usuário atualizada com sucesso" });
        }
        catch (KeyNotFoundException)
        {
            // Caso o usuário não seja encontrado, retorna um status 404 Not Found
            return NotFound(new { message = "Usuário não encontrado" });
        }
        catch (Exception ex)
        {
            // Para outros tipos de erro, retorna um status 500 Internal Server Error
            return StatusCode(500,
                              new { message = "Um erro ocorreu ao editar a senha do usuário", error = ex.Message });
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
            return Ok(new { message = "Usuário deletado com sucesso" });
        }
        catch (KeyNotFoundException)
        {
            // Caso o usuário não seja encontrado, retorna um status 404 Not Found
            return NotFound(new { message = "Usuário não encontrado" });
        }
        catch (Exception ex)
        {
            // Para outros tipos de erro, retorna um status 500 Internal Server Error
            return StatusCode(500, new { message = "Um erro ocorreu ao deletar o usuário", error = ex.Message });
        }
    }
}