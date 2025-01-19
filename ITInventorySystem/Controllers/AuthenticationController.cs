using ITInventorySystem.Models;
using ITInventorySystem.Repositories.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;

namespace ITInventorySystem.Controllers;

[Route("auth")]
[ApiController]
public class AuthenticationController(IAuthenticationInterface authenticationInterface) : ControllerBase
{
    [HttpPost("login")]
    public async Task<ActionResult<User>> Authenticate([FromBody] LoginRequest? loginRequest) =>
        loginRequest is null
            ? BadRequest("Dados de login inválidos.")
            : Ok(await authenticationInterface.Authenticate(loginRequest.Email, loginRequest.Password));

    [HttpGet("dashboard")]
    [Authorize]
    public string? Dashboard() => User.Identity?.Name;

    [HttpGet("clients-page")]
    [Authorize]
    public string? ClientsPage() => User.Identity?.Name;

    [HttpGet("inventory-page")]
    [Authorize]
    public string? InventoryPage() => User.Identity?.Name;

    [HttpGet("work-orders-page")]
    [Authorize]
    public string? WorkOrdersPage() => User.Identity?.Name;

    [HttpGet("users-page")]
    [Authorize(Roles = "Admin, Master")]
    public string? UsersPage() => User.Identity?.Name;

    [HttpGet("movements-page")]
    [Authorize]
    public string? MovementsPage() => User.Identity?.Name;
}