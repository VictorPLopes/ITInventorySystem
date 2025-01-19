using ITInventorySystem.DTO.WorkOrder;
using ITInventorySystem.Models;

namespace ITInventorySystem.Repositories.Interfaces;

public interface IWorkOrderInterface
{
    Task<IEnumerable<WorkOrder>> GetAllAsync();
    Task<WorkOrder>              GetByIdAsync(int            id);
    Task<IEnumerable<WorkOrder>> GetByClientIdAsync(int      clientId);
    Task<WorkOrder>              AddAsync(WorkOrderCreateDto workOrder);
    Task<WorkOrder>              UpdateAsync(int             id, WorkOrderUpdateDto workOrder);
    Task                         DeleteAsync(int             id);
}