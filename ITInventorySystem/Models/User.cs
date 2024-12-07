using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using ITInventorySystem.Models.Enums;

namespace ITInventorySystem.Models;

public class User
{
    public int Id { get; set; }

    [StringLength(100)] public string Name { get; set; }

    [Required]
    [StringLength(100)]
    [EmailAddress]
    public string Email { get; set; }

    [Required] [JsonIgnore] public byte[] PasswordHash { get; set; } = new byte[32];

    [Required] [JsonIgnore] public byte[] PasswordSalt { get; set; } = new byte[32];

    public string Token { get; set; } = "";

    public EPrivilegeType Type { get; set; }

    public bool Status { get; set; } = true;

    [JsonIgnore] public ICollection<WorkOrder> WorkOrders { get; set; } // Um usuário pode ter várias ordens de serviço

    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }
}