using ITInventorySystem.DTO.User;
using ITInventorySystem.Models;

namespace ITInventorySystem.Repositories.Interfaces;

public interface IUserInterface
{
    Task<IEnumerable<User>> GetAllAsync();
    Task<User> GetByIdAsync(int id);
    Task<User> GetByEmailAsync(string email);
    Task<User> AddAsync(UserCreateDto user);
    Task<User> UpdateAsync(UserUpdateDto user);
    Task UpdatePasswordAsync(UserUpdatePasswordDto user);
    Task DeleteAsync(int id);
}