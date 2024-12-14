using ITInventorySystem.DTO.Client;
using ITInventorySystem.Models;
using ITInventorySystem.Repositories.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ITInventorySystem.Controllers;

[ApiController]
[Route("dashboard")]
public class DashboardController(IDashboardService dashboardService) : ControllerBase
{
    [HttpGet("summary")]
    public async Task<IActionResult> GetSummary()
    {
        var summary = await dashboardService.GetSummaryAsync();
        return Ok(summary);
    }

    [HttpGet("top-products")]
    public async Task<IActionResult> GetTopProducts()
    {
        var topProducts = await dashboardService.GetTopProductsAsync();
        return Ok(topProducts);
    }
}