namespace ITInventorySystem.Exceptions;

public class StockMovementException(string message, int errorCode) : Exception(message)
{
    public int ErrorCode { get; } = errorCode;
}