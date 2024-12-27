using ITInventorySystem.Data;
using ITInventorySystem.DTO.User;
using ITInventorySystem.Models;
using ITInventorySystem.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ITInventorySystem.Repositories.Services;

public class UserService(AppDbContext context) : IUserInterface
{
    public async Task<User> AddAsync(UserCreateDto user)
    {
        if (await context.Users.AnyAsync(userDb => userDb.Email == user.Email))
            throw new InvalidOperationException("Email already in use!");

        HashPassword.Hash(user.Password, out var passwordHash, out var passwordSalt);

        var newUser = new User
        {
            Name         = user.Name,
            Email        = user.Email,
            PasswordHash = passwordHash,
            PasswordSalt = passwordSalt,
            Type         = user.Type
        };

        context.Users.Add(newUser);
        await context.SaveChangesAsync();

        return newUser;
    }

    public async Task<IEnumerable<User>> GetAllAsync() => await context.Users.ToListAsync();

    public async Task<User> GetByIdAsync(int id)
    {
        var user = await context.Users.FirstOrDefaultAsync(userDb => userDb.Id == id);

        if (user == null)
            throw new KeyNotFoundException("User not found!");

        return user;
    }

    public async Task<User> GetByEmailAsync(string email)
    {
        var user = await context.Users.FirstOrDefaultAsync(userDb => userDb.Email == email);

        if (user == null)
            throw new KeyNotFoundException("User not found!");

        return user;
    }

    public async Task<User> UpdateAsync(int id, UserUpdateDto user)
    {
        if (await context.Users.AnyAsync(userDb => userDb.Email == user.Email && userDb.Id != id))
            throw new InvalidOperationException("Email already in use!");

        var userDb = await context.Users.FirstOrDefaultAsync(userDb => userDb.Id == id);

        if (userDb == null)
            throw new KeyNotFoundException("User not found!");

        userDb.Name      = user.Name;
        userDb.Email     = user.Email;
        userDb.Type      = user.Type;
        userDb.Status    = user.Status;
        userDb.UpdatedAt = DateTime.Now;

        context.Users.Update(userDb);
        await context.SaveChangesAsync();

        return userDb;
    }

    public async Task UpdatePasswordAsync(int id, string newPassword)
    {
        var userDb = await context.Users.FirstOrDefaultAsync(userDb => userDb.Id == id);

        if (userDb == null)
            throw new KeyNotFoundException("User not found!");

        HashPassword.Hash(newPassword, out var passwordHash, out var passwordSalt);
        userDb.PasswordHash = passwordHash;
        userDb.PasswordSalt = passwordSalt;

        context.Users.Update(userDb);
        await context.SaveChangesAsync();
    }

    public async Task UpdateMyPasswordAsync(int id, string oldPassword, string newPassword)
    {
        var userDb = await context.Users.FirstOrDefaultAsync(userDb => userDb.Id == id);
        
        if (userDb == null)
            throw new KeyNotFoundException("User not found!");

        if (!HashPassword.Verify(oldPassword, userDb.PasswordHash, userDb.PasswordSalt))
            throw new InvalidOperationException("Incorrect old password!");
        
        HashPassword.Hash(newPassword, out var passwordHash, out var passwordSalt);
        userDb.PasswordHash = passwordHash;
        userDb.PasswordSalt = passwordSalt;
        
        context.Users.Update(userDb);
        await context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        try
        {
            var user = await context.Users.FirstOrDefaultAsync(userDb => userDb.Id == id);

            if (user == null)
                throw new KeyNotFoundException("User not found!");

            context.Users.Remove(user);
            await context.SaveChangesAsync();
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }
    }
}