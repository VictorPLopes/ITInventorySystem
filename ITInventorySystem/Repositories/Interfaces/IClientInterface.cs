using ITInventorySystem.DTO.Client;
using ITInventorySystem.Models;

namespace ITInventorySystem.Repositories.Interfaces;

public interface IClientInterface
{
    Task<Client>              GetByIdAsync(int         id);
    Task<IEnumerable<Client>> GetAllAsync(bool         includeDeleted = false);
    Task<Client>              AddAsync(ClientCreateDto client);
    Task                      UpdateAsync(int          id, ClientUpdateDto client);
    Task                      DeleteAsync(int          id);
}