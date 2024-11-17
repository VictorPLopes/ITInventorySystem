namespace ITInventorySystem.DTO.User;

public class UserUpdatePasswordDTO
{
    public int Id { get; set; }
    public string Password { get; set; }
    public string NewPassword { get; set; }
}