using ITInventorySystem.DTO.Client;
using ITInventorySystem.Models;

namespace ITInventorySystem.Repositories.Interfaces;

public interface IClientInterface
{
    Task<Client>GetByIdAsync(int id);
    Task<IEnumerable<Client>> GetAllAsync();
    Task<Client> AddAsync(ClientCreateDTO client);
    Task UpdateAsync(ClientUpdateDTO client);
    Task DeleteAsync(int id);
}