using System.ComponentModel.DataAnnotations.Schema;

namespace ITInventorySystem.Models;

public class ProductsInWorkOrder
{
    [ForeignKey("Product")]
    public int ProductId { get; set; } // Chave estrangeira para Product

    [ForeignKey("WorkOrder")]
    public int WorkOrderId { get; set; } // Chave estrangeira para WorkOrder

    public int ProductQuantity { get; set; }

    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }
}