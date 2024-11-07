using ITInventorySystem.DTO.User;
using ITInventorySystem.Models;

namespace ITInventorySystem.Repositories.Interfaces;

public interface IUserInterface
{
    Task<User> GetByIdAsync(int id);
    Task<User> GetByEmailAsync(string email);
    Task<User> AddAsync(UserCreateDTO user);
    Task UpdateAsync(UserUpdateDTO user);
    Task DisableAsync(User user);
    Task DeleteAsync(int id);
    Task<User> Login(string email, string password);
    string HashPassword(string password);
    bool VerifyPassword(string password, string storedHash);
}