using ITInventorySystem.Models;

namespace ITInventorySystem.Repositories.Interfaces;

public interface IUserInterface
{
    Task<User> GetByIdAsync(int       id);
    Task<User> GetByEmailAsync(string email);
    Task       AddAsync(User          user);
    Task       UpdateAsync(User       user);
    Task       DisableAsyn(User       user);
    Task       DeleteAsync(int        id);
    Task<User> Login(string           email, string password);
    string     HashPassword(string    password);
    bool       VerifyPassword(string  password, string storedHash);
}