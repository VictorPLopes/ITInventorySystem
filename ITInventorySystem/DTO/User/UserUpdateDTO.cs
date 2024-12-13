using ITInventorySystem.Models.Enums;

namespace ITInventorySystem.DTO.User;

public class UserUpdateDto
{
    public string         Name   { get; set; }
    public string         Email  { get; set; }
    public EPrivilegeType Type   { get; set; }
    public bool           Status { get; set; }
}