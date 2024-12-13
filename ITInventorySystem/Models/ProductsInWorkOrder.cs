using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ITInventorySystem.Models;

public class ProductsInWorkOrder
{
    public int     ProductId { get; set; }
    public Product Product   { get; set; }

    public int WorkOrderId { get; set; }

    [JsonIgnore] public WorkOrder WorkOrder { get; set; }

    public int ProductQuantity { get; set; }

    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }
}