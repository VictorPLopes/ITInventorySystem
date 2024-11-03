using ITInventorySystem.Models;

namespace ITInventorySystem.Repositories.Interfaces
{
    public interface IWorkOrderInterface
    {
        Task<WorkOrder> GetByIdAsync(int id);
        Task<IEnumerable<WorkOrder>> GetAllAsync();
        Task AddAsync(WorkOrder workOrder);
        Task UpdateAsync(WorkOrder workOrder);
        Task DeleteAsync(int id);
    }
}
