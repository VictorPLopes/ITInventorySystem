using ITInventorySystem.DTO.WorkOrder;
using ITInventorySystem.Models;

namespace ITInventorySystem.Repositories.Interfaces;

public interface IWorkOrderInterface
{
    Task<WorkOrder> GetByIdAsync(int id);
    Task<IEnumerable<WorkOrder>> GetAllAsync();
    Task<WorkOrder> AddAsync(WorkOrderCreateDTO workOrder);
    Task<WorkOrder> UpdateAsync(WorkOrderUpdateDTO workOrder);
    Task DeleteAsync(int id);
}