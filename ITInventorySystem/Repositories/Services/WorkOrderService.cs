using ITInventorySystem.Models;
using ITInventorySystem.Repositories.Interfaces;

namespace ITInventorySystem.Repositories.Implementations
{
    public class WorkOrderService : IWorkOrderInterface
    {
        public Task AddAsync(WorkOrder workOrder)
        {
            throw new NotImplementedException();
        }

        public Task DeleteAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<WorkOrder>> GetAllAsync()
        {
            throw new NotImplementedException();
        }

        public Task<WorkOrder> GetByIdAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task UpdateAsync(WorkOrder workOrder)
        {
            throw new NotImplementedException();
        }
    }
}
