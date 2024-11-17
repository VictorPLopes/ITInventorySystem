using ITInventorySystem.DTO.User;
using ITInventorySystem.Models;

namespace ITInventorySystem.Repositories.Interfaces;

public interface IUserInterface
{
    Task<IEnumerable<User>> GetAllAsync();
    Task<User>              GetByIdAsync(int                          id);
    Task<User>              GetByEmailAsync(string                    email);
    Task<User>              AddAsync(UserCreateDTO                    user);
    Task<User>              UpdateAsync(UserUpdateDTO                 user);
    Task                    UpdatePasswordAsync(UserUpdatePasswordDTO user);
    Task<User>              UpdateStatusAsync(UserUpdateStatusDTO     user);
    Task                    DeleteAsync(int                           id);
    Task<User>              Login(string                              email, string password);
}