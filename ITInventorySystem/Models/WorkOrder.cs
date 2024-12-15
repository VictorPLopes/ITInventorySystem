using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using ITInventorySystem.Models.Enums;

namespace ITInventorySystem.Models;

public class WorkOrder
{
    public int Id { get; set; }

    public DateTime StartDate { get; set; }

    [Required] public int UserInChargeId { get; set; } // Chave estrangeira para User

    [Required] public int ClientId { get; set; } // Chave estrangeira para Client

    [Required] public Client Client { get; set; }

    [Required] public User UserInCharge { get; set; }

    [StringLength(1000)] public string? Description { get; set; }

    [Column(TypeName = "decimal(18,2)")] public decimal WorkHours { get; set; }

    public EWorkOrderStatus Status { get; set; } = EWorkOrderStatus.Pending;

    public ICollection<ProductsInWorkOrder> Products { get; set; } =
        new List<ProductsInWorkOrder>(); // Uma ordem de serviço pode ter vários produtos

    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }
}