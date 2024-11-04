using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ITInventorySystem.Models;

public class Product
{
    public int Id { get; set; }

    [Required] [StringLength(100)] public string Name { get; set; }

    public int Quantity { get; set; }

    [StringLength(500)] public string? Description { get; set; }

    [StringLength(100)] public string? Category { get; set; }

    [Column(TypeName = "decimal(18,2)")] public decimal CostPrice { get; set; }

    [Column(TypeName = "decimal(18,2)")] public decimal SalePrice { get; set; }

    [StringLength(100)] public string? BrandManufacturerName { get; set; }

    public ICollection<WorkOrder> WorkOrders { get; set; }

    public ICollection<ProductsInWorkOrder>
        ProductsInWorkOrder { get; set; } // Um produto pode estar em várias ordens de serviço

    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public DateTime CreatedAt { get; set; }

    [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
    public DateTime? UpdatedAt { get; set; }
}