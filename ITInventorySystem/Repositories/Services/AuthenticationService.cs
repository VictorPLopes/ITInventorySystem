using ITInventorySystem.Data;
using ITInventorySystem.Models;
using ITInventorySystem.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ITInventorySystem.Repositories.Services;

public class AuthenticationService(AppDbContext context) : IAuthenticationInterface
{
    public async Task<User> Authenticate(string email, string password)
    {
        var user = await context.Users.FirstOrDefaultAsync(userDb => userDb.Email == email);

        if (user is null || !HashPassword.Verify(password, user.PasswordHash, user.PasswordSalt))
            throw new KeyNotFoundException("Incorrect email or password!");

        // Gerar o token
        user.Token = TokenService.GenerateToken(user);

        return user;
    }
}