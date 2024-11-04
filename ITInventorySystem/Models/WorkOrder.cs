using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using ITInventorySystem.Models.Enums;

namespace ITInventorySystem.Models;

public class WorkOrder
{
    public int Id { get; set; }

    public DateTime StartDate { get; set; }

    [Required] public Client Client   { get; set; }
    [Required] public int    ClientId { get; set; } // Chave estrangeira para Client

    public            User UserInCharge   { get; set; }
    [Required] public int  UserInChargeId { get; set; } // Chave estrangeira para User

    [StringLength(1000)] public string Description { get; set; }

    [Column(TypeName = "decimal(18,2)")] public decimal WorkHours { get; set; }

    public EWorkOrderStatus Status { get; set; } = EWorkOrderStatus.Pending;

    public ICollection<Product> Products { get; set; }

    public ICollection<ProductsInWorkOrder>
        ProductsInWorkOrder { get; set; } // Uma ordem de serviço pode ter vários produtos

    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public DateTime CreatedAt { get; set; }

    [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
    public DateTime? UpdatedAt { get; set; }
}