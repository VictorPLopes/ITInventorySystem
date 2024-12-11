namespace ITInventorySystem.DTO.WorkOrder;

public class WorkOrderCreateDto
{
    public DateTime                      StartDate      { get; set; }
    public int                           UserInChargeId { get; set; } // ID do funcionário responsável
    public int                           ClientId       { get; set; } // ID do cliente
    public string?                       Description    { get; set; }
    public decimal                       WorkHours      { get; set; }
    public List<WorkOrderProductInfoDto> Products       { get; set; } = new();
}