using ITInventorySystem.Models;

namespace ITInventorySystem.Repositories.Interfaces;

public interface IAuthenticationInterface
{
    Task<User> Authenticate(string email, string password);
}