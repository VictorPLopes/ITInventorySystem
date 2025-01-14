using ITInventorySystem.DTO.User;
using ITInventorySystem.Models;

namespace ITInventorySystem.Repositories.Interfaces;

public interface IUserInterface
{
    Task<IEnumerable<User>> GetAllAsync( bool includeDeleted = false );
    Task<User> GetByIdAsync(int id);
    Task<User> GetByEmailAsync(string email);
    Task<User> AddAsync(UserCreateDto user);
    Task<User> UpdateAsync(int id, UserUpdateDto user);
    Task UpdatePasswordAsync(int   id, string newPassword);
    Task UpdateMyPasswordAsync(int id, string oldPassword, string newPassword);
    Task  DeleteAsync(int id);
}