using ITInventorySystem.Data;
using ITInventorySystem.Models;
using ITInventorySystem.Repositories.Interfaces;

namespace ITInventorySystem.Repositories.Implementations;

public class UserService : IUserInterface
{
    private readonly AppDbContext _context;

    public UserService(AppDbContext context)
    {
        _context = context;
    }
    public Task<User> AddAsync(User user) => throw new NotImplementedException();

    public Task DeleteAsync(int id) => throw new NotImplementedException();

    public Task DisableAsyn(User user) => throw new NotImplementedException();

    public Task<User> GetByEmailAsync(string email) => throw new NotImplementedException();

    public Task<User> GetByIdAsync(int id) => throw new NotImplementedException();

    public string HashPassword(string password) => throw new NotImplementedException();

    public Task<User> Login(string email, string password) => throw new NotImplementedException();

    public Task UpdateAsync(User user) => throw new NotImplementedException();

    public bool VerifyPassword(string password, string storedHash) => throw new NotImplementedException();
}