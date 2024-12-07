using ITInventorySystem.Models.Enums;

namespace ITInventorySystem.DTO.User;

public class UserCreateDto
{
    public string Name { get; set; }
    public string Email { get; set; }
    public string Password { get; set; }
    public EPrivilegeType Type { get; set; }
}