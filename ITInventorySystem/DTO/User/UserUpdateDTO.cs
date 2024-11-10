using ITInventorySystem.Models.Enums;

namespace ITInventorySystem.DTO.User;

public class UserUpdateDTO
{
    public int            Id    { get; set; }
    public string         Name  { get; set; }
    public string         Email { get; set; }
    public string         Password { get; set; }
    public EPrivilegeType Type  { get; set; }
}