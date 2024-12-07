using ITInventorySystem.Models;
using ITInventorySystem.Repositories.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;

namespace ITInventorySystem.Controllers;

public class AuthenticationController(IAuthenticationInterface authenticationInterface) : ControllerBase
{
    [HttpPost("Login")]
    public async Task<ActionResult<User>> Authenticate([FromBody] LoginRequest? loginRequest) =>
        loginRequest is null
            ? BadRequest("Dados de login inválidos.")
            : Ok(await authenticationInterface.Authenticate(loginRequest.Email, loginRequest.Password));

    [HttpGet("Dashboard")]
    [Authorize]
    public string? Dashboard() => User.Identity?.Name;

    [HttpGet("ClientsPage")]
    [Authorize]
    public string? ClientsPage() => User.Identity?.Name;

    [HttpGet("InventoryPage")]
    [Authorize]
    public string? InventoryPage() => User.Identity?.Name;

    [HttpGet("WorkOrdersPage")]
    [Authorize]
    public string? WorkOrdersPage() => User.Identity?.Name;

    [HttpGet("UsersPage")]
    [Authorize(Roles = "Admin, Master")]
    public string? UsersPage() => User.Identity?.Name;
}