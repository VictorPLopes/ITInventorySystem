using ClosedXML.Excel;
using ITInventorySystem.Data;
using ITInventorySystem.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ITInventorySystem.Repositories.Services;

public class ReportService : IReportInterface
{
    private readonly AppDbContext _context;

    public ReportService(AppDbContext context) => _context = context;

    /// <summary>
    ///     Gera um relatório de movimentação de estoque dentro de um intervalo de datas.
    /// </summary>
    public async Task<byte[]> GenerateStockMovementReportAsync(DateTime startDate, DateTime endDate)
    {
        var stockMovements = await _context.StockMovements
                                           .Include(sm => sm.Product)
                                           .Where(sm => sm.CreatedAt >= startDate && sm.CreatedAt <= endDate)
                                           .Select(sm => new
                                           {
                                               sm.Id,
                                               Produto = sm.Product.Name,
                                               sm.Quantity,
                                               Tipo = sm.MovementType.ToString(),
                                               sm.Description,
                                               Data = sm.CreatedAt
                                           })
                                           .ToListAsync();

        using (var workbook = new XLWorkbook())
        {
            var worksheet = workbook.Worksheets.Add("Movimentação de Estoque");
            worksheet.Cell(1, 1).Value = "ID";
            worksheet.Cell(1, 2).Value = "Produto";
            worksheet.Cell(1, 3).Value = "Quantidade";
            worksheet.Cell(1, 4).Value = "Tipo de Movimentação";
            worksheet.Cell(1, 5).Value = "Descrição";
            worksheet.Cell(1, 6).Value = "Data";

            var row = 2;
            foreach (var movement in stockMovements)
            {
                worksheet.Cell(row, 1).Value = movement.Id;
                worksheet.Cell(row, 2).Value = movement.Produto;
                worksheet.Cell(row, 3).Value = movement.Quantity;
                worksheet.Cell(row, 4).Value = movement.Tipo;
                worksheet.Cell(row, 5).Value = movement.Description;
                worksheet.Cell(row, 6).Value = movement.Data.ToString("dd/MM/yyyy HH:mm:ss");
                row++;
            }

            using (var stream = new MemoryStream())
            {
                workbook.SaveAs(stream);
                return stream.ToArray();
            }
        }
    }

    /// <summary>
    ///     Gera um relatório de ordens de serviço dentro de um intervalo de datas.
    /// </summary>
    public async Task<byte[]> GenerateWorkOrderReportAsync(DateTime startDate, DateTime endDate)
    {
        var workOrders = await _context.WorkOrders
                                       .Include(w => w.Client)
                                       .Include(w => w.UserInCharge)
                                       .Include(w => w.Products)
                                       .ThenInclude(p => p.Product)
                                       .Where(w => w.StartDate >= startDate && w.StartDate <= endDate)
                                       .Select(w => new
                                       {
                                           w.Id,
                                           w.StartDate,
                                           Cliente     = w.Client.Name,
                                           Responsável = w.UserInCharge.Name,
                                           w.Description,
                                           Produtos =
                                               string.Join(", ",
                                                           w.Products.Select(p => $"{p.Product.Name} (x{p.Quantity})")),
                                           w.WorkHours,
                                           Status = w.Status.ToString()
                                       })
                                       .ToListAsync();

        using (var workbook = new XLWorkbook())
        {
            var worksheet = workbook.Worksheets.Add("Ordens de Serviço");
            worksheet.Cell(1, 1).Value = "ID";
            worksheet.Cell(1, 2).Value = "Data";
            worksheet.Cell(1, 3).Value = "Cliente";
            worksheet.Cell(1, 4).Value = "Responsável";
            worksheet.Cell(1, 5).Value = "Descrição";
            worksheet.Cell(1, 6).Value = "Produtos";
            worksheet.Cell(1, 7).Value = "Horas Trabalhadas";
            worksheet.Cell(1, 8).Value = "Status";

            var row = 2;
            foreach (var order in workOrders)
            {
                worksheet.Cell(row, 1).Value = order.Id;
                worksheet.Cell(row, 2).Value = order.StartDate.ToString("dd/MM/yyyy");
                worksheet.Cell(row, 3).Value = order.Cliente;
                worksheet.Cell(row, 4).Value = order.Responsável;
                worksheet.Cell(row, 5).Value = order.Description;
                worksheet.Cell(row, 6).Value = order.Produtos;
                worksheet.Cell(row, 7).Value = order.WorkHours;
                worksheet.Cell(row, 8).Value = order.Status;
                row++;
            }

            using (var stream = new MemoryStream())
            {
                workbook.SaveAs(stream);
                return stream.ToArray();
            }
        }
    }
}