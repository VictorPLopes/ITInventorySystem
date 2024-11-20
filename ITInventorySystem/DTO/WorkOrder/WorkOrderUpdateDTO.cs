using ITInventorySystem.Models.Enums;

namespace ITInventorySystem.DTO.WorkOrder
{
    public class WorkOrderUpdateDTO
    {
        public int Id { get; set; }
        public DateTime StartDate { get; set; }
        public int UserInChargeId { get; set; } // ID do funcionário responsável
        public int ClientId { get; set; } // ID do cliente
        public string? Description { get; set; }
        public decimal WorkHours { get; set; }
        public EWorkOrderStatus NewStatus { get; set; }
        public List<WorkOrderProductInfoDTO> Products { get; set; } = new List<WorkOrderProductInfoDTO>();
    }
}
