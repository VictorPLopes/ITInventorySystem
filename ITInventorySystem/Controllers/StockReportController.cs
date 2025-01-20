using ITInventorySystem.Repositories.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace ITInventorySystem.Controllers
{
    [Route("reports")]
    [ApiController]
    public class StockReportController(IReportInterface reportService) : ControllerBase
    {
        /// <summary>
        /// Gera e baixa o relatório de movimentação de estoque filtrado por período.
        /// </summary>
        [HttpGet("stock-movement")]
        public async Task<IActionResult> DownloadStockMovementReport([FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
        {
            if (startDate > endDate)
                return BadRequest(new { message = "A data de início não pode ser maior que a data de fim." });

            var fileBytes = await reportService.GenerateStockMovementReportAsync(startDate, endDate);
            return File(fileBytes, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "MovimentacaoEstoque.xlsx");
        }

        /// <summary>
        /// Gera e baixa o relatório de ordens de serviço filtrado por período.
        /// </summary>
        [HttpGet("work-orders")]
        public async Task<IActionResult> DownloadWorkOrderReport([FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
        {
            if (startDate > endDate)
                return BadRequest(new { message = "A data de início não pode ser maior que a data de fim." });

            var fileBytes = await reportService.GenerateWorkOrderReportAsync(startDate, endDate);
            return File(fileBytes, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "RelatorioOrdensDeServico.xlsx");
        }
    }
}