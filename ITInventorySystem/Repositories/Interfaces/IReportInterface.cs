namespace ITInventorySystem.Repositories.Interfaces;

public interface IReportInterface
{
    Task<byte[]> GenerateStockMovementReportAsync(DateTime startDate, DateTime endDate);
    Task<byte[]> GenerateWorkOrderReportAsync(DateTime     startDate, DateTime endDate);
}