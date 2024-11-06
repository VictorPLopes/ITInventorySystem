using ITInventorySystem.Data;
using ITInventorySystem.Models;
using ITInventorySystem.Repositories.Interfaces;

namespace ITInventorySystem.Repositories.Implementations;

public class ClientService : IClientInterface
{
    private readonly AppDbContext _context;

    public ClientService(AppDbContext context)
    {
        _context = context;
    }
    public Task DeleteAsync(int id) => throw new NotImplementedException();

    public Task<IEnumerable<Client>> GetAllAsync() => throw new NotImplementedException();

    public Task<Client> GetByIdAsync(int id) => throw new NotImplementedException();

    public Task UpdateAsync(Client client) => throw new NotImplementedException();

    Task<Client> IClientInterface.AddAsync(Client client)
    {
        throw new NotImplementedException();
    }
}