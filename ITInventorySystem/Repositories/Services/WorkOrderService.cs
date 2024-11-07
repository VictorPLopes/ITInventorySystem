using ITInventorySystem.Data;
using ITInventorySystem.DTO.WorkOrder;
using ITInventorySystem.Models;
using ITInventorySystem.Repositories.Interfaces;

namespace ITInventorySystem.Repositories.Implementations;

public class WorkOrderService : IWorkOrderInterface
{
    private readonly AppDbContext _context;

    public WorkOrderService(AppDbContext context)
    {
        _context = context;
    }

    public Task<WorkOrder> AddAsync(WorkOrderCreateDTO workOrder)
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

    public Task UpdateAsync(WorkOrderUpdateDTO workOrder)
    {
        throw new NotImplementedException();
    }
}